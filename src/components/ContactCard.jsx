import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContactContext } from '../store';
import { phonePrefixOptions, cityOptions } from '../components/AddContact';

const ContactCard = ({ contact }) => {
  const { deleteContact } = useContext(ContactContext);

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      deleteContact(contact.id);
    }
  };
   const getPhonePrefix = (phoneNumber) => {
    const prefix = phonePrefixOptions.find(p => phoneNumber.startsWith(p));
    return prefix || '';
  };
   const getPhoneNumberWithoutPrefix = (phoneNumber) => {
    const prefix = getPhonePrefix(phoneNumber);
    return phoneNumber.substring(prefix.length);
  };
   const getCityFromAddress = (address) => {
    const parts = address.split(', ');
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (cityOptions.includes(lastPart)) {
      return lastPart;
      // }
    }
    return '';
  };
  }
  
  const prefix = getPhonePrefix(contact.phone);
  const phoneNumberWithoutPrefix = getPhoneNumberWithoutPrefix(contact.phone);
  const city = getCityFromAddress(contact.address);
  const addressWithoutCity = contact.address.replace(`, ${city}`, '').trim();


  return (
    <div className="contact-card">
      <h3 data-initials={`${contact.name.split(' ')[0]?.[0] || ''}${contact.name.split(' ')[1]?.[0] || ''}`}>
  {contact.name}
</h3>
      <p className="tel"><strong>TELÉFONO:</strong> {prefix} {phoneNumberWithoutPrefix}</p>
  <p className="email"><strong>EMAIL:</strong> {contact.email}</p>
  <p className="address"><strong>DIRECCIÓN:</strong> {addressWithoutCity}</p>
      {city && <p className="city"><strong>CIUDAD:</strong> {city}</p>}
      <div className="actions">
        <Link to={`/edit/${contact.id}`}>Editar</Link>
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
};

export default ContactCard;