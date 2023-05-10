import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Wrapper from '../second-components/wrapper/Wrapper';
import { Container } from 'reactstrap';
import TestingApi from '../../services/testingApi.js';
import {
	InputWithLabel
} from '../second-components/form-autorization-inputs/InputWithLabel.js';
import styles from './authorization.module.css';

const { horizontal_line } = styles;

export default function Authorization() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		}
	});

	const authorization = async (data) => {
		const api = new TestingApi();
		await api.authorization(data).then(({ access, refresh, is_moderator }) => {
			localStorage.setItem('jwt_token', access)
			localStorage.setItem('refresh_token', refresh)
			const pathname = is_moderator ? '/moderator' : '/user';
			navigate(pathname);
		}).catch(err => {
			console.log('err', err)
			setError('email', {message: 'Неверно введен логин или пароль'});
		});
	};

	const emailErrorMessage = 'Пожалуйста, введите электронную почту';
	const passwordErrorMessage = 'Пожалуйста, введите пароль';

	return (
		<Wrapper>
			<Container className="shadow_element bg-light rounded-3">
				<form onSubmit={handleSubmit(authorization)}
							style={{ maxWidth: '550px', minHeight: '100vh' }}
							className="d-flex flex-column justify-content-evenly mx-auto text-primary">
					<div className="d-flex flex-column">
						<h1 className="mb-5">Вход в систему</h1>
						<InputWithLabel errors={errors}
														type="email"
														title="Электронная почта"
														register={register('email',
															{ required: emailErrorMessage })}/>
						<InputWithLabel errors={errors}
														type="password"
														title="Пароль"
														register={register('password',
															{ required: passwordErrorMessage })}/>
						<Link to="/recovery-password" className="text-primary mx-auto">
							Восстановление пароля
						</Link>
					</div>
					<div className="d-flex flex-column justify-content-between">
						<button type="submit"
										className="btn text-primary border border-2 fs-5 p-3">
							{'Войти'.toUpperCase()}
						</button>
						<p className="mb-5">-----------------------------------------Или----------------------------------------</p>
						<button type="submit"
										className="btn text-primary border border-2 fs-5 p-3">
							{'Зарегистрироваться'.toUpperCase()}
						</button>
					</div>
						
				</form>
			</Container>
		</Wrapper>
	);
}