import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // Obtener todos los documentos de una colección
  getCollection(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).valueChanges();
  }

  // Obtener un documento por ID
  getDocument(collectionName: string, docId: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(docId).valueChanges();
  }

  // Agregar un nuevo documento a una colección
  addDocument(collectionName: string, data: any) {
    return this.firestore.collection(collectionName).add(data);
  }

  // Actualizar un documento existente
  updateDocument(collectionName: string, docId: string, data: any) {
    return this.firestore.collection(collectionName).doc(docId).update(data);
  }

  // Eliminar un documento
  deleteDocument(collectionName: string, docId: string) {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }

}