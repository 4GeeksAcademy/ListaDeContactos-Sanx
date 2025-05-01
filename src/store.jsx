import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const ContactContext = createContext();

// Creamos el proveedor del contexto
export const ContactProvider = ({ children }) => {
  // Estado para almacenar la lista de contactos
  const [contacts, setContacts] = useState([]);
  // Estado para manejar mensajes de error o éxito
  const [message, setMessage] = useState(null);
  // El "slug" de tu agenda (reemplaza con el tuyo)
  const agendaSlug = 'Sanx'; // ¡Importante! Reemplaza esto con tu slug único

  const API_URL = 'https://playground.4geeks.com/contact';

  // Función para obtener todos los contactos de la API
  const getContacts = async () => {
    const url = `${API_URL}/agendas/${agendaSlug}/contacts`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Si la respuesta no es exitosa (status code fuera de 200-299)
        const errorText = await response.text();
        console.error('Error fetching contacts:', response.status, response.statusText, errorText);
        setMessage('Error al cargar los contactos.');
        return; // Importante: detener la función si hay un error
      }
      const data = await response.json(); // <------------------ AQUÍ llamamos a .json()
      console.log('GET - Data:', data); // <------------------ Para ver la estructura de los datos
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setMessage('Error al cargar los contactos.');
    }
  };

  // Función para crear un nuevo contacto
  const createContact = async (newContact) => {
    const url = `${API_URL}/agendas/${agendaSlug}/contacts`;
    try {
      const response = await fetch(`${API_URL}/agendas/${agendaSlug}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });
      const data = await response.json();
      setContacts(contacts && contacts.contacts ? [...contacts.contacts, data] : [data]);
      console.log(contacts)
      setMessage('Contacto creado exitosamente.');
      getContacts();
      return true; // Indica que la creación fue exitosa
    } catch (error) {
      console.error('Error creating contact:', error);
      setMessage('Error al crear el contacto.');
      return false; // Indica que hubo un error
    }
  };

  // Función para actualizar un contacto existente
  const updateContact = async (id, updatedContact) => {
    const url = `${API_URL}/agendas/${agendaSlug}/contacts/${id}`;
    try {
      const response = await fetch(`${API_URL}/agendas/${agendaSlug}/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContact),
      });

      const data = await response.json();
      const updatedContacts = contacts && contacts.contacts ? contacts.contacts.map((contact) =>
        contact.id === id ? data : contact
      ) : [];
      setContacts(updatedContacts); // Actualizamos el estado con el contacto modificado
      setMessage('Contacto actualizado exitosamente.');
      getContacts()
      return true; // Indica que la actualización fue exitosa
    } catch (error) {
      console.error('Error updating contact:', error);
      setMessage('Error al actualizar el contacto.');
      return false; // Indica que hubo un error
    }
  };

  // Función para eliminar un contacto
  const deleteContact = async (id) => {
    const url = `${API_URL}/agendas/${agendaSlug}/contacts/${id}`;
    try {
      await fetch(`${API_URL}/agendas/${agendaSlug}/contacts/${id}`, {
        method: 'DELETE',
      });
      const updatedContacts = contacts && contacts.contacts ? contacts.contacts.filter((contact) => contact.id !== id) : [];
      setContacts(updatedContacts); // Actualizamos el estado eliminando el contacto
      setMessage('Contacto eliminado exitosamente.');
      getContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      setMessage('Error al eliminar el contacto.');
    }
  };

  // Efecto para cargar los contactos iniciales al montar el componente
  useEffect(() => {
    getContacts();
  }, []); // Se ejecuta solo una vez al inicio

  return (
    <ContactContext.Provider
      value={{
        contacts,
        message,
        getContacts,
        createContact,
        updateContact,
        deleteContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};