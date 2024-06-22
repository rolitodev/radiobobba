import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // Obtener todos los documentos de una colección
  getCollection(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any; // Obteniendo los datos del documento
        const id = a.payload.doc.id; // Obteniendo el ID del documento
        return { id, ...data }; // Combinando el ID con los datos del documento
      }))
    );
  }

  getCollectionv2(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName, ref => ref.orderBy('date', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any; // Obteniendo los datos del documento
        const id = a.payload.doc.id; // Obteniendo el ID del documento
        return { id, ...data }; // Combinando el ID con los datos del documento
      }))
    );
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