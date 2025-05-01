import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContactContext } from '../store'; 
import ContactCard from '../components/ContactCard';

const Contact = () => {
  const { contacts, message } = useContext(ContactContext); 
  const contactList = contacts ? contacts.contacts : []; 

  return (
    <div>
      <h2>Lista de Contactos</h2>
      {message && <p>{message}</p>} 
      <Link to="/add">Agregar Nuevo Contacto</Link>
      <div className="contact-list">
      {Array.isArray(contactList) && contactList.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
};

export default Contact;