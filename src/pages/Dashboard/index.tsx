/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line
import React, { useState, useEffect, FormEvent } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
//style
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo.svg';


interface Repository {
	full_name: string;
	description: string;
	owner: {
		login: string;
		avatar_url: string;
	};
}

const DashBoard: React.FC = () => {
	const [newRepo, setNewRepo] = useState('');
	const [inputError, setInputError] = useState('');
	const [repositories, setRepositories] = useState<Repository[]>(() => {
		const storagedRepositories = localStorage.getItem(
			'@GithubExplorer:repositories',
		);
		if (storagedRepositories) {
			return JSON.parse(storagedRepositories);
		} else {
			return [];
		}
	});

	useEffect(() => {
		localStorage.setItem(
			'@GithubExplorer:repositories',
			JSON.stringify(repositories),
		);
	}, [repositories]);

	async function handleAddRepository(
		event: FormEvent<HTMLFormElement>,
	): Promise<void> {
		event.preventDefault();

		if (!newRepo) {
			return setInputError('Digite o autor/nome do repositorio');
		}

		try {
			const response = await api.get<Repository>(`/repos/${newRepo}`);
			const repository = response.data;
			setRepositories([...repositories, repository]);
			setNewRepo('');
			setInputError('');
		} catch (err) {
			setInputError('Erro na busca por esse repositorio');
		}
	}

	return (
		<div className="dashboard-container">
			<img src={logoImg} alt="Github Explorer" />
			<Title>Explore Repositorios do GitHub</Title>
			<Form hasError={!!inputError} onSubmit={handleAddRepository}>
				<input
					type="text"
					placeholder="Digite o nome do repositorio"
					value={newRepo}
					onChange={e => setNewRepo(e.target.value)}
				/>

				<button type="submit"> Pesquisar</button>
			</Form>

			{inputError && <Error> {inputError} </Error>}

			<Repositories>
				{repositories.map(repository => (
					<Link
						key={repository.full_name}
						to={`/repository/${repository.full_name}`}
					>
						<img
							src={repository.owner.avatar_url}
							alt={repository.owner.login}
						/>
						<div>
							<strong> {repository.full_name} </strong>
							<p> {repository.description} </p>
						</div>
						<FiChevronRight size={20} />
					</Link>
				))}
			</Repositories>
		</div>
	);
};

export default DashBoard;
