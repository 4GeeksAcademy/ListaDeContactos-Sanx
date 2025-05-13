import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactContext } from '../store'; 
import ContactCard from '../components/ContactCard';
import './Contact.css';

const phonePrefixOptions = ['', '+1', '+34', '+44', '+49', '+33'];
const cityOptions = ['', 'Madrid', 'Valencia', 'Jackson', 'New York', 'Paris', 'Lyon', 'Berlin', 'Munich', 'London', 'Manchester'];

const Contact = () => {
  const { contacts, message } = useContext(ContactContext); 
  const contactList = contacts && contacts.contacts ? contacts.contacts : [];
  const [nameFilter, setNameFilter] = useState('');
  const [prefixFilter, setPrefixFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const filteredContacts = contactList.filter(contact => {
    const nameMatch = contact.name.toLowerCase().includes(nameFilter.toLowerCase());
    const prefixMatch = prefixFilter === '' || contact.phone.startsWith(prefixFilter);
    const cityMatch = cityFilter === '' || contact.address.endsWith(`, ${cityFilter}`);
    return nameMatch && prefixMatch && cityMatch;
  });

  return (
     <div className="contact-view">
      <div className="filter-sidebar">
        <h3></h3>
        <div>
          <label htmlFor="nameFilter">Nombre:</label>
          <div className="input-wrapper">
          <input
            type="text"
            id="nameFilter"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Buscar por nombre"
          />
        </div>
        </div>
        <div>
          <label htmlFor="prefixFilter">Prefijo:</label>
          <div className="input-wrapper">
          <select
            id="prefixFilter"
            value={prefixFilter}
            onChange={(e) => setPrefixFilter(e.target.value)}
          >
            {phonePrefixOptions.map(prefix => (
              <option key={prefix} value={prefix}>{prefix || 'Todos'}</option>
            ))}
          </select>
          </div>
        </div>
        <div>
          <label htmlFor="cityFilter">Ciudad:</label>
          <div className="input-wrapper">
          <select
            id="cityFilter"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {cityOptions.map(city => (
              <option key={city} value={city}>{city || 'Todas'}</option>
            ))}
          </select>
          </div>
        </div>
      </div>

      <div className="contact-list-area">
  <Link to="/add" className="add-contact-card">
    <div className="add-icon">+</div>
  </Link>
  {filteredContacts.map((contact) => (
    <ContactCard key={contact.id} contact={contact} />
  ))}
</div>
    </div>
  );
};

export default Contact;