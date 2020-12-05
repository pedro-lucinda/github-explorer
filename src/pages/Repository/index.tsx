// @typescript-eslint/no-unused-vars
// eslint-disable-next-line
import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import api from '../../services/api';
//imgs + styles
import logoimg from '../../assets/logo.svg';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParms {
	repository: string;
}

interface Repository {
	full_name: string;
	description: string;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	owner: {
		login: string;
		avatar_url: string;
	};
}

interface Issue {
	title: string;
	id: number;
	user: {
		login: string;
	};
	html_url: string;
}

const Repository: React.FC = () => {
	const { params } = useRouteMatch<RepositoryParms>();
	const [repository, setRepository] = useState<Repository | null>(null);
	// eslint-disable-next-line
	const [issues, setIssues] = useState<Issue[]>([]);

	useEffect(() => {
		api.get(`repos/${params.repository}`).then(response => {
			setRepository(response.data);
		});

		api.get(`repos/${params.repository}/issues`).then(response => {
			setIssues(response.data);
		});
	}, [params.repository]);

	return (
		<>
			<Header>
				<img src={logoimg} alt="Github Explorer" />
				<Link to="/">
					<FiChevronLeft size={16} />
					voltar
				</Link>
			</Header>
			{repository && (
				<RepositoryInfo>
					<header>
						<img src={repository.owner.avatar_url} />
						<div>
							<strong> {repository.full_name} </strong>
							<p> {repository.description} </p>
						</div>
					</header>
					<ul>
						<li>
							<strong>{repository.stargazers_count}</strong>
							<span> Stars </span>
						</li>
						<li>
							<strong> {repository.forks_count} </strong>
							<span> Forks </span>
						</li>
						<li>
							<strong>{repository.open_issues_count}</strong>
							<span> Issues Abertos</span>
						</li>
					</ul>
				</RepositoryInfo>
			)}
			<Issues>
				{issues?.map(issue => (
					<a href={issue.html_url} target="__blank" key={issue.id}>
						<div>
							<strong> {issue.title} </strong>
							<p> {issue.user.login} </p>
						</div>
						<FiChevronRight size={20} />
					</a>
				))}
			</Issues>
		</>
	);
};

export default Repository;
