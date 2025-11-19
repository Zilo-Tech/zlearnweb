// components/TutorCard.tsx
import Image from 'next/image';
import { Star, Users } from 'lucide-react';
import { Tutor } from './data';

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <div className="bg-white border-2 border-primary-950">
      <div className="flex flex-col items-center  w-full">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src={tutor.image}
            alt={tutor.name}
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 py-4 space-y-1.5 bg-primary-300 w-full px-4">
          <h1 className="font-semibold text-2xl md:text-3xl text-gray-900 mt-2">{tutor.name}</h1>
          <p className="text-primary-950 font-bold text-xl md:text-2xl px-1">{tutor.subject}</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-medium">{tutor.rating}</span>
            </div>
            <div className="flex items-center space-x-1 ">
              <Users className="w-3 h-3" />
              <span className="text-lg text-gray-900">{tutor.students}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}