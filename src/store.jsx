import React, { createContext, useState, useEffect } from 'react';

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState(null);
  const agendaSlug = 'Sanx';

  const API_URL = 'https://playground.4geeks.com/contact';

  const checkAndCreateAgenda = async () => {
    try {
      const response = await fetch(`${API_URL}/agendas/${agendaSlug}/contacts`);
      if (!response.ok && response.status === 404) {
        // La agenda no existe, intentamos crearla
        console.log('Agenda no encontrada, intentando crear...');
        const createResponse = await fetch(`${API_URL}/agendas/${agendaSlug}`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({}), 
        });

        if (createResponse.ok) {
          console.log('Agenda creada exitosamente.');
          setMessage('Agenda creada exitosamente.');
          
          getContacts();
        } else {
          const errorText = await createResponse.text();
          console.error('Error al crear la agenda:', createResponse.status, createResponse.statusText, errorText);
          setMessage('Error al crear la agenda.');
        }
      } else if (response.ok) {
        const data = await response.json(); 
        console.log('GET - Data:', data); 
        setContacts(data);
      } else {
        const errorText = await response.text();
        console.error('Error al verificar la agenda:', response.status, response.statusText, errorText);
        setMessage('Error al cargar los contactos.');
      }
    } catch (error) {
      console.error('Error al verificar/crear la agenda:', error);
      setMessage('Error al verificar/crear la agenda.');
    }
  };
  // Función para obtener todos los contactos de la API
  const getContacts = async () => {
    const url = `${API_URL}/agendas/${agendaSlug}/contacts`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
       
        const errorText = await response.text();
        console.error('Error fetching contacts:', response.status, response.statusText, errorText);
        setMessage('Error al cargar los contactos.');
        return; 
      }
      const data = await response.json(); 
      console.log('GET - Data:', data); 
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setMessage('Error al cargar los contactos.');
    }
  };

  // Función para crear un contacto
  const createContact = async (newContact) => {
    const url = `${API_URL}/agendas/${agendaSlug}/contacts`;
    try {
      const response = await fetch(url, {
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
      return true; 
    } catch (error) {
      console.error('Error creating contact:', error);
      setMessage('Error al crear el contacto.');
      return false; 
    }
  };

  // Función para actualizar un contacto 
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
      setContacts(updatedContacts); 
      setMessage('Contacto actualizado exitosamente.');
      getContacts()
      return true; 
    } catch (error) {
      console.error('Error updating contact:', error);
      setMessage('Error al actualizar el contacto.');
      return false; 
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
      setContacts(updatedContacts);
      setMessage('Contacto eliminado exitosamente.');
      getContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      setMessage('Error al eliminar el contacto.');
    }
  };

  useEffect(() => {
    checkAndCreateAgenda();
  }, []);

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