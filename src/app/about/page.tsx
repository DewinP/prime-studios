import Image from "next/image";
import { Music, Users, Settings } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center border-r border-l bg-white px-4 py-12 text-gray-900">
      <div className="flex w-full max-w-5xl flex-col gap-20">
        {/* Hero Section */}
        <section className="mb-8 flex w-full flex-col items-center gap-10 md:flex-row">
          <div className="w-full md:w-1/2">
            <div className="mb-6 -rotate-6 overflow-hidden rounded-lg shadow-2xl md:mb-0 md:-ml-8">
              <Image
                src="https://picsum.photos/seed/studio-hero/600/400"
                alt="Prime Studio Main Room"
                width={600}
                height={400}
                className="h-64 w-full object-cover md:h-80"
                priority
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start md:w-1/2 md:pl-8">
            <h1 className="mb-4 text-5xl font-extrabold">Prime Studio</h1>
            <h2 className="mb-4 text-2xl font-semibold text-yellow-500">
              Where Inspiration Meets Sound
            </h2>
            <p className="text-lg text-gray-700">
              A creative sanctuary for artists, producers, and dreamers. Step
              inside and let your music journey begin.
            </p>
          </div>
        </section>
        {/* Story Section */}
        <section className="mb-8 flex w-full flex-col items-center">
          <h2 className="mb-4 text-center text-3xl font-bold">Our Story</h2>
          <p className="max-w-2xl text-center text-gray-700">
            Founded by passionate musicians, Prime Studio was built on the
            belief that every artist deserves a space to create, experiment, and
            thrive. Our mission is to foster creativity and community, providing
            the tools and support you need to bring your vision to life. Whether
            you&#39;re recording your first track or your hundredth, you&#39;ll
            find a home here.
          </p>
        </section>
        {/* Features Section */}
        <section className="mb-8 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6 text-center shadow-md">
            <Music className="mb-3 h-12 w-12 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold">
              World-class Equipment
            </h3>
            <p className="text-gray-600">
              From vintage mics to the latest digital gear, we have everything
              you need for a professional sound.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6 text-center shadow-md">
            <Settings className="mb-3 h-12 w-12 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold">Creative Atmosphere</h3>
            <p className="text-gray-600">
              Our acoustically treated rooms and cozy lounges are designed to
              spark inspiration and comfort.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6 text-center shadow-md">
            <Users className="mb-3 h-12 w-12 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold">Experienced Team</h3>
            <p className="text-gray-600">
              Our engineers and producers are here to help you every step of the
              way, from idea to final mix.
            </p>
          </div>
        </section>
        {/* Team Section */}
        <section className="flex w-full flex-col items-center">
          <h2 className="mb-6 text-center text-3xl font-bold">Meet the Team</h2>
          <div className="flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6 shadow-md">
              <Image
                src="https://picsum.photos/seed/team1/200/200"
                alt="Team Member 1"
                width={120}
                height={120}
                className="mb-3 rounded-full object-cover"
              />
              <h4 className="text-lg font-semibold">Alex Rivera</h4>
              <span className="text-gray-600">Lead Producer</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6 shadow-md">
              <Image
                src="https://picsum.photos/seed/team2/200/200"
                alt="Team Member 2"
                width={120}
                height={120}
                className="mb-3 rounded-full object-cover"
              />
              <h4 className="text-lg font-semibold">Jamie Lee</h4>
              <span className="text-gray-600">Sound Engineer</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6 shadow-md">
              <Image
                src="https://picsum.photos/seed/team3/200/200"
                alt="Team Member 3"
                width={120}
                height={120}
                className="mb-3 rounded-full object-cover"
              />
              <h4 className="text-lg font-semibold">Morgan Smith</h4>
              <span className="text-gray-600">Studio Manager</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
