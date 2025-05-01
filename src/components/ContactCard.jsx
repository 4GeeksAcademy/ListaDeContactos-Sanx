import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Para la navegación
import { ContactContext } from '../store'; // Importamos el contexto

const ContactCard = ({ contact }) => {
  const { deleteContact } = useContext(ContactContext);

  const handleDelete = () => {
    // Aquí podrías implementar la lógica del modal opcional
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      deleteContact(contact.id);
    }
  };

  return (
    <div className="contact-card">
      <h3>{contact.name}</h3>
      <p>Teléfono: {contact.phone}</p>
      <p>Email: {contact.email}</p>
      <p>Dirección: {contact.address}</p>
      <div className="actions">
      <Link to={`/edit/${contact.id}`}>Editar</Link>
      <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
};

export default ContactCard;