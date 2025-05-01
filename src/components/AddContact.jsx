import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ContactContext } from '../store'; 

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

  useEffect(() => {
    if (id) {
      const contactToEdit = contacts && contacts.contacts ? contacts.contacts.find((contact) => contact.id === parseInt(id)) : undefined;
      if (contactToEdit) {
        setFormData(contactToEdit);
      }
    } else {
      setFormData({ name: '', phone: '', email: '', address: '' });
    }
  }, [id, contacts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
     
      const success = await updateContact(parseInt(id), formData);
      if (success) {
        navigate('/');
      }
    } else {
      
      const success = await createContact(formData);
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Dirección:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{id ? 'Guardar Cambios' : 'Agregar Contacto'}</button>
        <Link to="/">Cancelar</Link>
      </form>
    </div>
  );
};

export default AddContact;