const Features = () => {
  return (
    <section id="features" className="px-10 py-16 bg-[#EBF2FA]">
      {' '}
      {/* Background */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:bg-[#A5BE00]"
            >
              {' '}
              {/* Hover effect */}
              <img
                src={feature.image}
                alt={feature.title}
                className="mx-auto mb-4"
                style={{ width: '250px', height: '250px' }}
              />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    image: '/Real-Time-Tracking.png',
    title: 'Real-Time Tracking',
    description:
      'Monitor your workout progress in real-time with our easy-to-use app.',
  },
  {
    image: '/Goal-Setting.png',
    title: 'Goal Setting',
    description:
      'Set personalized fitness goals and track your progress with data insights.',
  },
  {
    image: '/Nutrition-Tracking.png',
    title: 'Nutrition Tracking',
    description:
      'Log your meals and monitor your nutrition intake for better results.',
  },
];

export default Features;
