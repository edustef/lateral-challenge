'use server';

import { createClient, getClaims } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createBooking(
  formData: FormData
): Promise<{ bookingId?: string; error?: string }> {
  const stayId = formData.get('stayId') as string;
  const slug = formData.get('slug') as string;
  const checkIn = formData.get('checkIn') as string;
  const checkOut = formData.get('checkOut') as string;
  const guests = Number(formData.get('guests'));
  const contactName = formData.get('contactName') as string;
  const contactEmail = formData.get('contactEmail') as string;
  const contactPhone = (formData.get('contactPhone') as string) || null;
  const totalPrice = Number(formData.get('totalPrice'));

  const supabase = await createClient();

  const user = await getClaims();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Basic validation
  if (new Date(checkOut) <= new Date(checkIn)) {
    return { error: 'Check-out must be after check-in' };
  }
  if (guests < 1) {
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
      return { error: 'These dates are no longer available' };
    }
    return { error: error.message };
  }

  redirect(`/stays/${slug}/book/confirmation?id=${data.id}`);
}
