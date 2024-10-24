import { Link } from 'react-router-dom';
import { path } from '../utils/path';

const Pricing = () => {
  return (
    <section id="pricing" className="px-10 py-16 bg-[#EBF2FA]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold">Choose Your Plan</h2>
        <p className="mt-4 text-gray-700">
          Select a plan that best suits your needs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{plan.title}</h3>
              <p className="mt-4 text-gray-600">{plan.description}</p>
              <p className="mt-2 text-4xl font-bold">{plan.price}</p>
              <Link
                to={path.REGISTER}
                className="block mt-8 bg-[#427AA1] text-white py-3 px-6 rounded-lg hover:bg-[#679436]"
              >
                Get Started
              </Link>{' '}
              {/* Updated button */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const pricingPlans = [
  {
    title: 'Basic Plan',
    description: 'Ideal for beginners',
    price: '$9.99/month',
  },
  {
    title: 'Pro Plan',
    description: 'For serious fitness enthusiasts',
    price: '$19.99/month',
  },
  {
    title: 'Premium Plan',
    description: 'All-inclusive access',
    price: '$29.99/month',
  },
];

export default Pricing;
