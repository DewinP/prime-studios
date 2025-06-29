import Image from "next/image";
import { MapPin, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex-col justify-center p-10">
      <div className="mx-auto h-[60vh] w-[800px] overflow-hidden rounded-lg">
        <Image
          src="/studio-equipment.jpg"
          alt="Prime Studio Inside"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <section className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-blue-400">
          <MapPin className="h-6 w-6" />
          <span className="text-lg text-gray-100">
            1234 Studio Lane, City, Country
          </span>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <Mail className="h-6 w-6" />
          <span className="text-lg text-gray-100">hello@yourcompany.com</span>
        </div>
      </section>
    </main>
  );
}
