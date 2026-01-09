"use client";

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-[#e2f4ff] border-y border-[#bcdff5] py-2">
      <marquee className="whitespace-nowrap animate-marquee font-semibold text-[#005d88] text-[16px]">
        अत्याधुनिक सुविधाएं • अनुभवी डॉक्टर व स्टाफ • घर जैसी देखभाल • पूर्ण
        NABH मान्यता प्राप्त अस्पताल • सभी प्रमुख हेल्थ इंश्योरेंस (TPA)
        ,मुख्यमंत्री आयुष्मान आरोग्य (MAA) योजना कैशलेस इलाज की सुविधा •
      </marquee>
    </div>
  );
}
