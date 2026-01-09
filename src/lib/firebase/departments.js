import { db } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = 'departments';

export async function getDepartments() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const departments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: departments };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function addDepartment(departmentData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...departmentData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDepartment(id, departmentData) {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...departmentData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteDepartment(id) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}