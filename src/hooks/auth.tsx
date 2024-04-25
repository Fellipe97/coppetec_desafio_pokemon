import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from "react";

import { useToast } from 'native-base'
import { auth, db } from '../config/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail, createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'




type User = {
    id: string;
    email: string;
    name: string;
    favorites?: string[];
}

type AuthContextData = {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    redefinePassword: (email: string) => Promise<void>;
    redefinePasswordLogged: (oldPassword: string, newPassword: string) => Promise<void>;
    registerUser: (name: string, email: string, password: string) => Promise<{ success: string, error: string }>;
    user: User | null;
    isLoadingSigIn: boolean;
    isLoadingStorage: boolean;
    isLoadingRedefinePassword: boolean;
    isLoadingRegisterUser: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
}

const USER_COLLECTION = '@ufrjPokemon:users';

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const toast = useToast();
    const [user, setUser] = useState<User | null>(null)
    const [isLoadingSigIn, setIsLoadingSigIn] = useState(false)
    const [isLoadingStorage, setIsLoadingStorage] = useState(false)
    const [isLoadingRedefinePassword, setIsLoadingRedefinePassword] = useState(false)
    const [isLoadingRegisterUser, setIsLoadingRegisterUser] = useState(false)

    async function loadUserSorageData() {
        setIsLoadingStorage(true)
        try {
            const storedUser = await AsyncStorage.getItem(USER_COLLECTION)
            if (storedUser) {
                let resp = await validateUserUid(JSON.parse(storedUser).id)
                if (!resp.error) {
                    setUser(resp as User)
                } else {
                    console.log('Error: ', resp.error)
                    setUser(null)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingStorage(false)
        }
    }

    async function validateUserUid(userUid: string) {
        try {
            const userRef = doc(db, "users", userUid);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return {
                    id: userSnapshot.id,
                    ...userData
                };
            } else {
                return {
                    error: 'Não existe usuário.'
                };
            }
        } catch (error) {
            console.error('Erro ao validar UID do usuário:', error);
            return {
                error: 'Errro ao se comunicar com o banco de dados.'
            };
        }
    }

    async function signIn(email: string, password: string) {
        toast.closeAll();
        setIsLoadingSigIn(true)
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const userRef = doc(db, "users", userCredential.user.uid);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();

                    const updatedUser = {
                        id: userCredential.user.uid,
                        ...userData
                    };
                    await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(updatedUser))
                    setUser(updatedUser as User)

                } else {
                    return toast.show({
                        title: 'Login',
                        description: 'Não foi possivel buscar os dados do perfil do usuário.',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }
            })
            .catch((error) => {
                console.log('\n\nERROOO...')
                let errorTitle = 'Login'
                let errorMessage = ''

                if (error.code == 'auth/network-request-failed') {
                    errorMessage = 'Falha de conexão ao se conectar ao banco de dados.'
                }
                else if (error.code == 'auth/user-not-found') {
                    errorMessage = 'Usuário não cadastrado.'
                }
                else if (error.code == 'auth/wrong-password') {
                    errorMessage = 'Senha incorreta.'
                }
                else if (error.code == 'auth/too-many-requests') {
                    errorMessage = 'Tivemos problemas no banco de dados, tente novamente mais tarde.'
                }
                else if (error.code == 'auth/invalid-credential') {
                    errorMessage = 'Usuário ou senha incorreta.'
                }
                else {
                    error.message = 'Não foi possível realizar o login.'
                }
                console.log(error.code, error.message)
                return toast.show({
                    title: errorTitle,
                    description: errorMessage,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }).finally(
                () => setIsLoadingSigIn(false)
            )
    }

    async function signOut() {
        await auth.signOut();
        await AsyncStorage.removeItem(USER_COLLECTION);
        setUser(null)
    }

    async function redefinePassword(email: string) {
        toast.closeAll();
        setIsLoadingRedefinePassword(true)
        sendPasswordResetEmail(auth, email)
            .then(() => {
                return toast.show({
                    title: 'Redefinir senha',
                    description: 'E-mail enviado com sucesso, verifica a caixa de entrada.',
                    placement: 'top',
                    bgColor: 'emerald.500'
                })
            })
            .catch((error) => {
                let errorTitle = 'Redefinir senha'
                let errorMessage = ''

                if (error.code == 'auth/network-request-failed') {
                    errorMessage = 'Falha de conexão ao se conectar ao banco de dados.'
                }
                else if (error.code == 'auth/invalid-email') {
                    errorMessage = 'E-mail digitado inválido.'
                }
                else if (error.code == 'auth/user-not-found') {
                    errorMessage = 'Usuário não cadastrado.'
                }
                else {
                    errorMessage = 'Não foi possível enviar e-mail para redefinição de senha.'
                }
                console.log(error)
                return toast.show({
                    title: errorTitle,
                    description: errorMessage,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }).finally(
                () => setIsLoadingRedefinePassword(false)
            );

    } 


    async function registerUser(name:string, email: string, password: string) {
        try {
            setIsLoadingRegisterUser(true)
            // Cria o usuário na autenticação
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
    
            // Salva os dados no Firestore
            const userRef = doc(db, "users", uid);
            await setDoc(userRef, {
                name,
                email
            });
    
            // Atualiza o estado com o novo usuário
            setUser({
                id: uid,
                name,
                email
            });
    
            // Salva o usuário no AsyncStorage
            await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify({
                id: uid,
                name,
                email
            }));
    
            setIsLoadingRegisterUser(false);
            return { success: 'Usuário registrado com sucesso!', error: '' };
        } catch (error) {
            setIsLoadingRegisterUser(false);
            console.error("Error registering user:", error);
            return { success: '', error: 'Erro ao registrar usuário. Tente novamente.' };
        }
    }
    

    async function redefinePasswordLogged(oldPassword: string, newPassword: string) {
        toast.closeAll();
        setIsLoadingRedefinePassword(true)

        const userCurrent = auth.currentUser;

        const credential = EmailAuthProvider.credential(userCurrent?.email!, oldPassword);

        await reauthenticateWithCredential(userCurrent!, credential)
            .then(() => {
                setIsLoadingRedefinePassword(true)
                console.log('Senha está correta')
                updatePassword(userCurrent!, newPassword)
                    .then(() => {
                        return toast.show({
                            title: 'Redefinir senha',
                            description: 'Senha redefinida com sucesso.',
                            placement: 'top',
                            bgColor: 'emerald.500'
                        })
                    })
                    .catch((error) => {
                        let errorTitle = 'Redefinir senha'
                        let errorMessage = ''

                        if (error.code == 'auth/network-request-failed') {
                            errorMessage = 'Falha de conexão ao se conectar ao banco de dados.'
                        }
                        if (error.code == 'auth/invalid-email') {
                            errorMessage = 'E-mail digitado inválido.'
                        }
                        else if (error.code == 'auth/user-not-found') {
                            errorMessage = 'Usuário não cadastrado.'
                        }
                        else {
                            errorMessage = 'Não foi possível enviar e-mail para redefinição de senha.'
                        }
                        console.log(error)
                        return toast.show({
                            title: errorTitle,
                            description: errorMessage,
                            placement: 'top',
                            bgColor: 'red.500'
                        })
                    }).finally(
                        () => setIsLoadingRedefinePassword(false)
                    );

            })
            .catch((error) => {
                let errorTitle = 'Redefinir senha'
                let errorMessage = ''

                if (error.code == 'auth/network-request-failed') {
                    errorMessage = 'Falha de conexão ao se conectar ao banco de dados.'
                }
                if (error.code == 'auth/invalid-email') {
                    errorMessage = 'E-mail digitado inválido.'
                }
                else if (error.code == 'auth/user-not-found') {
                    errorMessage = 'Usuário não cadastrado.'
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Senha antiga incorreta.';
                } else {
                    errorMessage = 'Erro durante a reautenticação.';
                }
                console.log(error)
                setIsLoadingRedefinePassword(false)
                return toast.show({
                    title: errorTitle,
                    description: errorMessage,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            })
    }

    useEffect(() => {
        loadUserSorageData();
    }, [])

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            redefinePassword,
            redefinePasswordLogged,
            registerUser,
            user,
            isLoadingSigIn,
            isLoadingStorage,
            isLoadingRedefinePassword,
            isLoadingRegisterUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}


function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth }