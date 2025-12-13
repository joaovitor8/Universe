"use client"

import axios from 'axios';
import { useEffect, useState } from 'react';


type FormData = {
  name: string;
  email: string;
  news: string[];
};

type NewsUser = {
  name: string;
  email: string;
  news: string[];
};

type Message = {
  text: string;
  type: 'success' | 'error';
};


export const FormAPI = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', news: [] });
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<Message | null>(null);

	const [getForm, setGetForm] = useState<NewsUser[]>([]);

	const apiOff = "http://127.0.0.1:4000"
  const apiOn = "https://api-universe.onrender.com"


	// -----------------------------------------------------------


  // Campos de texto
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// Checkboxes
	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		setFormData(prev => ({ ...prev, news: checked ? [...prev.news, value] : prev.news.filter(n => n !== value) }));
	};


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);

		if (!formData.name || !formData.email || formData.news.length === 0) {
			setMessage({ text: 'Please fill in all fields', type: 'error' });
			return;
		}

		setLoading(true);
		try {
			await axios.post(`${apiOn}/db/news/postUser`, formData );
			setMessage({ text: 'Registration successful!', type: 'success' });
			setFormData({ name: '', email: '', news: [] });

			await getUsersForm();
		} catch (error) {
			console.error('Error submitting form:', error);
			setMessage({ text: 'Error submitting form', type: 'error' });
		} finally {
			setLoading(false);
		}
	};


	// -----------------------------------------------------------


  const getUsersForm = async () => {
    try {
      const response = await axios.get(`${apiOn}/db/news/getUsers`);
      const usersWithParsedNews = response.data.map((user: NewsUser) => {
        // O backend pode enviar `news` como uma string JSON. Precisamos fazer o parse.
        if (typeof user.news === 'string') {
          try {
            return { ...user, news: JSON.parse(user.news) };
          } catch (e) {
            console.error('Falha ao fazer parse da string de notícias:', user.news);
            return { ...user, news: [] }; // Fallback para array vazio em caso de erro
          }
        }
        // Garante que seja sempre um array
        if (!Array.isArray(user.news)) {
          return { ...user, news: [] };
        }
        return user;
      });
      setGetForm(usersWithParsedNews);
    } catch (error) {
      console.error("Error trying to get users ( Erro ao buscar usuários )", error);
    }
  };


	// -----------------------------------------------------------


	const handleUpdate = async (email: string, data: FormData) => {
		setLoading(true);
		setMessage(null);
		try {
			await axios.put(`${apiOn}/db/news/updateUser/${email}`, data);
			setMessage({ text: 'User updated successfully!', type: 'success' });
			await getUsersForm();
		} catch (error) {
			console.error("Error trying to update user", error);
			setMessage({ text: 'Error updating user', type: 'error' });
		} finally {
			setLoading(false);
		}
	};


	// -----------------------------------------------------------


	const handleDelete = async (email: string) => {
    try {
      await axios.delete(`${apiOn}/db/news/deleteUser/${email}`);
      setMessage({ text: 'User deleted successfully', type: 'success' });
      // getUsersForm will be called by the component to refresh the list
    } catch (error) {
      console.error('Error deleting user', error);
      setMessage({ text: 'Error deleting user', type: 'error' });
    }
  };


	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => setMessage(null), 5000);
			return () => clearTimeout(timer);
		}

		getUsersForm();
	}, [message]);


  return { handleSubmit, message, formData, setFormData, handleInputChange, handleCheckboxChange, loading, getForm, handleDelete, handleUpdate }
}
