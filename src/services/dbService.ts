import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Service, ContactInfo } from '../types';
import { initialServices, initialContact } from '../data';

const SERVICES_COLLECTION = 'servicios';
const CONFIG_COLLECTION = 'configuracion';
const CONTACT_DOC_ID = 'contacto';

/**
 * Obtiene todos los trámites desde Firestore.
 * Si la colección está vacía, siembra automáticamente los datos iniciales de src/data.ts.
 */
export async function getServices(): Promise<(Service & { hidden?: boolean })[]> {
  try {
    const servicesCol = collection(db, SERVICES_COLLECTION);
    const snapshot = await getDocs(servicesCol);

    if (snapshot.empty) {
      console.log('Colección "servicios" vacía. Sembrando datos iniciales en Firestore...');
      await seedInitialServices();
      return initialServices;
    }

    const services = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
      } as Service & { hidden?: boolean };
    });

    return services;
  } catch (error) {
    console.warn('No se pudo conectar a Firestore para getServices(). Usando datos locales por defecto:', error);
    return initialServices;
  }
}

/**
 * Guarda o actualiza un trámite específico en la colección 'servicios'.
 */
export async function saveService(service: Service & { hidden?: boolean }): Promise<void> {
  try {
    const serviceRef = doc(db, SERVICES_COLLECTION, service.id);
    await setDoc(serviceRef, {
      ...service,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error(`Error al guardar el trámite ${service.id} en Firestore:`, error);
    throw error;
  }
}

/**
 * Guarda o actualiza un lote completo de trámites (ej. reordenamiento o visibilidad).
 */
export async function saveAllServices(services: (Service & { hidden?: boolean })[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    services.forEach((service) => {
      const ref = doc(db, SERVICES_COLLECTION, service.id);
      batch.set(ref, {
        ...service,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error al guardar lote de trámites en Firestore:', error);
    throw error;
  }
}

/**
 * Obtiene la configuración de contacto (incluyendo croquisUrl) desde Firestore.
 * Si el documento no existe, siembra initialContact.
 */
export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const contactRef = doc(db, CONFIG_COLLECTION, CONTACT_DOC_ID);
    const snap = await getDoc(contactRef);

    if (snap.exists()) {
      const data = snap.data() as Partial<ContactInfo>;
      return {
        ...initialContact,
        ...data,
      };
    }

    // Si no existe, sembramos los datos iniciales
    console.log('Documento de contacto no existe. Sembrando initialContact en Firestore...');
    await setDoc(contactRef, initialContact);
    return initialContact;
  } catch (error) {
    console.warn('No se pudo conectar a Firestore para getContactInfo(). Usando initialContact:', error);
    return initialContact;
  }
}

/**
 * Guarda la configuración de contacto en Firestore.
 */
export async function saveContactInfo(data: ContactInfo): Promise<void> {
  try {
    const contactRef = doc(db, CONFIG_COLLECTION, CONTACT_DOC_ID);
    await setDoc(contactRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error al guardar contacto en Firestore:', error);
    throw error;
  }
}

/**
 * Función interna para sembrar los trámites iniciales en Firestore.
 */
async function seedInitialServices(): Promise<void> {
  try {
    const batch = writeBatch(db);
    initialServices.forEach((service) => {
      const serviceRef = doc(db, SERVICES_COLLECTION, service.id);
      batch.set(serviceRef, {
        ...service,
        createdAt: new Date().toISOString()
      });
    });
    await batch.commit();
    console.log('Siembra inicial de trámites completada con éxito.');
  } catch (error) {
    console.error('Error al sembrar trámites en Firestore:', error);
  }
}
