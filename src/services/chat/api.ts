// Package imports.
import firestore from '@react-native-firebase/firestore';

// Type imports.
import * as FirebaseTypes from '../../types/firebase';

// Service implementation.s
const api = {

  allUserChatsQuery(
    userUID : FirebaseTypes.DocumentRefData,
  ) : FirebaseTypes.Query {
    // LÓGICA PLACEHOLDER. ALTERAR PARA RETORNAR LISTAS DE CHATS QUE CONTÉM O
    // USUÁRIO.
    return firestore().collection('chats');
  },

  getLastChatMessage(chatUID : string) : Promise<FirebaseTypes.DocumentData> {
    // LÓGICA PLACEHOLDER. ALTERAR PARA BUSCAR A ÚLTIMA MENSAGEM.
    return firestore().collection('chatMessages').doc(chatUID).get();
  },

};

// Export default.
export default api;
