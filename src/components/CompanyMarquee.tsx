/* eslint-disable @next/next/no-img-element */
const logos = [
  {
    name: 'Vercel',
    url: 'https://res.cloudinary.com/dfhp33ufc/image/upload/v1715881430/vercel_wordmark_dark_mhv8u8.svg',
  },
  {
    name: 'Nextjs',
    url: 'https://res.cloudinary.com/dfhp33ufc/image/upload/v1715881475/nextjs_logo_dark_gfkf8m.svg',
  },
  {
    name: 'Baruch',
    url: '/logos/baruch-logo.png',
  },
  {
    name: 'Accenture',
    url: '/logos/accenture-logo.png',
  },
  {
    name: 'CUNY',
    url: '/logos/cuny-logo.png',
  },
  {
    name: 'Pulp',
    url: '/logos/pulp-logo.png',
  },

];

export default function CompanyMarquee() {
  return (
    <section className="text-center">
      <div className="w-full py-10">
        Trusted by:
        <div className="mx-auto w-full px-4 md:px-8">
          <div
            className="group relative mt-6 flex gap-6 overflow-hidden p-2"
            style={{
              maskImage:
                'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)',
            }}
          >
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6"
                >
                  {logos.map((logo, key) => (
                    <div
                      key={key}
                      className="flex items-center justify-center h-16 w-32 filter brightness-0 invert rounded-md p-2"
                    >
                      <img
                        src={logo.url}
                        className="h-full w-full object-contain"
                        alt={`${logo.name}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}