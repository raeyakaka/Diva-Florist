<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    // Rapikan nomor HP (hapus spasi/strip) sebelum divalidasi
    protected function prepareForValidation(): void
    {
        foreach (['sender_phone', 'receiver_phone'] as $k) {
            if ($this->has($k)) {
                $this->merge([$k => preg_replace('/[\s-]/', '', (string) $this->input($k))]);
            }
        }
    }

    public function rules(): array
    {
        $hp = ['required', 'regex:/^(\+62|62|0)8\d{7,11}$/'];

        return [
            'sender_name' => 'required|string|max:100',
            'sender_phone' => $hp,
            'receiver_name' => 'required|string|max:100',
            'receiver_phone' => $hp,
            'address' => 'required|string|min:15|max:500',
            'delivery_date' => 'required|date|after:today',
            'delivery_slot' => 'required|in:09.00–12.00,12.00–15.00,15.00–18.00',
            'items' => 'required|array|min:1|max:20',
            'items.*.slug' => 'required|string|exists:products,slug',
            'items.*.size' => 'required|in:S,M,L',
            'items.*.qty' => 'required|integer|min:1|max:20',
            'items.*.message' => 'nullable|string|max:120',
        ];
    }

    public function messages(): array
    {
        return [
            'sender_phone.regex' => 'Isi nomor HP yang valid, contoh 081234567890.',
            'receiver_phone.regex' => 'Isi nomor HP penerima yang valid.',
            'address.min' => 'Tulis alamat lengkap (minimal 15 karakter).',
            'delivery_date.after' => 'Pilih tanggal kirim mulai besok.',
        ];
    }
}
