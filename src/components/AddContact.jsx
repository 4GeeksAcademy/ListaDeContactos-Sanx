import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ContactContext } from '../store'; 
import './AddContact.css';

export const phonePrefixOptions = ['', '+1', '+34', '+44', '+49', '+33'];
export const cityOptions = ['', 'Madrid', 'Valencia', 'Jackson', 'New York', 'Paris', 'Lyon', 'Berlin', 'Munich', 'London', 'Manchester'];

const AddContact = () => {
  const { createContact, updateContact, contacts } = useContext(ContactContext); 
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [phonePrefix, setPhonePrefix] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (id) {
      const contactToEdit = contacts && contacts.contacts ? contacts.contacts.find((contact) => contact.id === parseInt(id)) : undefined;
      if (contactToEdit) {
        setFormData(contactToEdit);
        const prefixMatch = phonePrefixOptions.find(prefix => contactToEdit.phone.startsWith(prefix));
        setPhonePrefix(prefixMatch || '');
         const parts = contactToEdit.address.split(', ');
        if (parts.length > 1 && cityOptions.includes(parts[parts.length - 1])) {
          setCity(parts[parts.length - 1]);
          setFormData(prevFormData => ({ ...prevFormData, address: parts.slice(0, -1).join(', ') }));
      }
    }
    } else {
      setFormData({ name: '', phone: '', email: '', address: '' });
      setPhonePrefix('');
      setCity('');
    }
  }, [id, contacts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handlePrefixChange = (e) => {
    setPhonePrefix(e.target.value);
  };

    const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPhoneNumber = phonePrefix + formData.phone;
     const fullAddress = formData.address + (city ? `, ${city}` : '');

    const contactDataToSubmit = {
      ...formData,
      phone: fullPhoneNumber,
      address: fullAddress,
    };
    if (id) {
     
      const success = await updateContact(parseInt(id), contactDataToSubmit);
      if (success) {
        navigate('/');
      }
    } else {
      
      const success = await createContact(contactDataToSubmit);
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="add-contact-container">
      <h2>{id ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name" 
          />
        </div>
       <div className="form-group phone-group">
          <label htmlFor="phone">Teléfono:</label>
          <select 
          id="phonePrefix" 
          name="phonePrefix" 
          value={phonePrefix} 
          onChange={handlePrefixChange}
          autoComplete="tel-country-code"
          >
            {phonePrefixOptions.map(prefix => (
              <option key={prefix} value={prefix}>{prefix || 'Sin prefijo'}</option>
            ))}
          </select>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone.replace(phonePrefix, '')}
            onChange={handleChange}
            autoComplete="tel-national" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Dirección:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            autoComplete="street-address"
          />
        </div>
            <div className="form-group">
          <label htmlFor="city">Ciudad:</label>
          <select 
          id="city" 
          name="city" 
          value={city} 
          onChange={handleCityChange}
          autoComplete="locality"
          >
            {cityOptions.map(cityOption => (
              <option key={cityOption} value={cityOption}>{cityOption || 'Sin ciudad'}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
        <button type="submit">{id ? 'Guardar Cambios' : 'Agregar Contacto'}</button>
        <Link to="/">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default AddContact;