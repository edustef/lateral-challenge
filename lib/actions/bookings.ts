'use server';

import { createClient, getClaims } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createBooking(
  formData: FormData
): Promise<{ bookingId?: string; error?: string }> {
  const start = performance.now();
  const actionName = 'createBooking';
  const stayId = formData.get('stayId') as string;
  const slug = formData.get('slug') as string;
  const checkIn = formData.get('checkIn') as string;
  const checkOut = formData.get('checkOut') as string;
  const guests = Number(formData.get('guests'));
  const contactName = formData.get('contactName') as string;
  const contactEmail = formData.get('contactEmail') as string;
  const contactPhone = (formData.get('contactPhone') as string) || null;
  const totalPrice = Number(formData.get('totalPrice'));

  console.log(`[action] ${actionName} start`, { stayId, checkIn, checkOut, guests });

  const supabase = await createClient();
  const user = await getClaims();

  if (!user) {
    console.log(`[action] ${actionName} redirect`, { duration: Math.round(performance.now() - start) + 'ms', reason: 'Not authenticated' });
    redirect(`/auth/login?redirect=/stays/${slug}/book`);
  }

  // Basic validation
  if (new Date(checkOut) <= new Date(checkIn)) {
    console.log(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: 'Invalid dates' });
    return { error: 'Check-out must be after check-in' };
  }
  if (guests < 1) {
    console.log(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: 'Invalid guests' });
    return { error: 'At least 1 guest is required' };
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      stay_id: stayId,
      user_id: user.id,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      total_price: totalPrice,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
    })
    .select('id')
    .single();

  if (error) {
    // Overlapping dates exclusion constraint or other DB errors
    if (error.code === '23P01') {
      console.error(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: 'Dates unavailable' });
      return { error: 'These dates are no longer available' };
    }
    console.error(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: error.message });
    return { error: error.message };
  }

  console.log(`[action] ${actionName} ok`, { duration: Math.round(performance.now() - start) + 'ms', bookingId: data.id });
  redirect(`/stays/${slug}/book/confirmation?id=${data.id}`);
}
