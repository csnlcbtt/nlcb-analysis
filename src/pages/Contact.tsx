import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <Layout>
      <div className="container py-6">
        <PageHeader title="Contact Us" description="We'd love to hear from you. Fill out the form below and we'll get back to you soon." />
        <ContactForm />
      </div>
    </Layout>
  );
};

export default Contact;
