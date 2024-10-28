const Contact = () => {
  return (
    <section id="contact" className="px-10 py-16 bg-[#EBF2FA]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold">Get in Touch</h2>
        <p className="mt-4 text-gray-600">
          Have questions? Reach out to our support team!
        </p>
        <a
          href="mailto:support@fitzo.com"
          className="mt-8 inline-block bg-[#427AA1] text-white py-3 px-8 rounded-full hover:bg-[#679436]"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default Contact;
