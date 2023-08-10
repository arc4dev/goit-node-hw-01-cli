import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = `${path.dirname(
  fileURLToPath(import.meta.url)
)}/db/contacts.json`;

const getContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');

    return JSON.parse(data);
  } catch (err) {
    console.log(err.message);
    return [];
  }
};

// TODO: udokumentuj każdą funkcję
async function listContacts() {
  const contacts = await getContacts();

  console.table(contacts);
}

async function getContactById(contactId) {
  const contacts = await getContacts();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (!contact) return console.log('Nie ma takiego kontaktu!');

  console.table(contact);
}

async function removeContact(contactId) {
  // 1. Get contacts
  const contacts = await getContacts();
  // 2. Check if contact with given id exist
  const contact = contacts.find((contact) => contact.id === contactId);

  if (!contact) return console.log('Nie ma takiego kontaktu!');
  // 3. Remove contact from list
  const newContacts = contacts.filter((contact) => contact.id !== contactId);
  // 4. Save new list to the file
  try {
    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      'utf-8'
    );

    console.log(`Kontakt zostal pomyslnie usuniety!`);
  } catch (err) {
    console.log('Nie udalo sie usunac kontaktu! Sprobuj ponownie...');
  }
}

async function addContact(name, email, phone) {
  // 1. Check for the same email contact
  const contacts = await getContacts();

  const contactExists = contacts.some(
    (contact) => contact.email.toLowerCase() === email.toLowerCase()
  );

  if (contactExists)
    return console.log('Kontakt z ta nazwa email juz istnieje!');

  // 2. Add contact
  const newContacts = [
    ...contacts,
    { id: nanoid(21), name, email: email, phone },
  ];

  // 3. Save new list to the file
  try {
    await fs.writeFile(contactsPath, JSON.stringify(newContacts), 'utf-8');

    console.log('Kontakt zostal pomyslne dodany!');
  } catch (err) {
    console.log('Nie udalo sie dodac kontaktu! Sprobuj ponownie...');
  }
}

export { listContacts, removeContact, addContact, getContactById };
