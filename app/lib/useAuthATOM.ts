'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';

export function useAuthATOM() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Escuchar el estado de autenticación en tiempo real
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Verificar estado de la cuenta en Firestore
          const userDocRef = doc(db, 'usuarios', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const estaActivo = data.estadoCuenta === 'activo' || data.estadoCuenta === true;

            if (estaActivo) {
              setUser(currentUser);
              setIsAuth(true);
              localStorage.setItem('atom_user_registered', 'true');
            } else {
              setIsAuth(false);
            }
          } else {
            setUser(currentUser);
            setIsAuth(true);
            localStorage.setItem('atom_user_registered', 'true');
          }
        } catch (error) {
          console.error('Error verificando la cuenta:', error);
          setIsAuth(true);
        }
      } else {
        setUser(null);
        setIsAuth(false);
        localStorage.removeItem('atom_user_registered');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAuth, loading };
}