import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import PropTypes from "prop-types";
import { FaCross } from "react-icons/fa";

export const List = props => {
	const [list, setList] = useState([]);

	// //this create the user at the api
	useEffect(() => {
		//download the list on api at the beginning
		getApi();
	}, [props.name]);

	const createUser = () => {
		fetch(
			`https://assets.breatheco.de/apis/fake/todos/user/${props.name}`,
			{
				method: "POST",
				body: JSON.stringify([]),
				headers: {
					"Content-Type": "application/json"
				}
			}
		)
			.then(resp => {
				return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
			})
			.then(response => {
				console.log("New user created");
				console.log(response);
			})
			.catch(error => {
				//error handling
				console.error(error);
			});
	};

	const getApi = () => {
		props.name != ""
			? (console.log("getapi rulando"),
			  fetch(
					`https://assets.breatheco.de/apis/fake/todos/user/${props.name}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					}
			  )
					.then(resp => {
						if (!resp.ok) {
							throw Error(console.log("error en el get"));
						}
						return resp.json();
					})
					.then(jsonData => {
						if (Array.isArray(jsonData)) {
							setList(jsonData);
						}
					})
					.catch(() => {
						createUser();
					}))
			: "";
	};

	const updateAPI = (sucessCallBack, failureCallBack, data) => {
		//REST
		fetch(
			`https://assets.breatheco.de/apis/fake/todos/user/${props.name}`,
			{
				method: "PUT",
				//convert to json your array or object
				body: JSON.stringify([...list, data]),
				headers: {
					"Content-Type": "application/json"
				}
			}
		)
			.then(resp => {
				return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
			})
			.then(response => {
				sucessCallBack();
			})
			.catch(error => {
				//error handling
				failureCallBack(error);
				console.error(error);
			});
	};

	const addTask = toDo => {
		//actualizar datos en la API
		updateAPI(
			() => {
				//api OK

				//add item localy
				setList([...list, toDo]);
			},
			error => {
				//api WRONG
				swal("api failed: " + error);
			},
			toDo
		);
	};

	const deleteTask = indexToDelete => {
		//delete local
		let newList = list.filter((e, i) => indexToDelete != i);
		setList(newList);

		//update APi
		fetch(
			`https://assets.breatheco.de/apis/fake/todos/user/${props.name}`,
			{
				method: "PUT",
				//convert to json your array or object
				body: JSON.stringify(newList),
				headers: {
					"Content-Type": "application/json"
				}
			}
		)
			.then(resp => {
				return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
			})
			.then(response => {
				console.log(response); //this will print on the console the exact object received from the server
			})
			.catch(error => {
				//error handling

				console.error(error);
			});
	};

	const markAsDone = index => {
		//change in local
		list[index].done == false
			? setList(
					list.splice(index, 1, {
						label: list[index].label,
						done: true
					})
			  )
			: setList(
					list.splice(index, 1, {
						label: list[index].label,
						done: false
					})
			  );
		//change in API
		fetch(
			`https://assets.breatheco.de/apis/fake/todos/user/${props.name}`,
			{
				method: "PUT",
				//convert to json your array or object
				body: JSON.stringify(list),
				headers: {
					"Content-Type": "application/json"
				}
			}
		)
			.then(resp => {
				return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
			})
			.then(response => {
				getApi();
			})
			.catch(error => {
				//error handling

				console.error(error);
			});
	};

	let newLI = list.map((item, index) => (
		<li key={index} className="list-group-item  container ">
			<div className="row">
				<div className="list-col col text-start ">
					<i className="fas fa-skull"></i> {item.label}
				</div>

				{list[index].done == false ? (
					<div
						className="list-col  col done text-center text-muted"
						onClick={() => {
							markAsDone(index);
						}}>
						Mark as done...
					</div>
				) : (
					<div
						className="list-col col done text-center text-success"
						onClick={() => {
							markAsDone(index);
						}}>
						Done!
					</div>
				)}

				<div
					className="list-col col trash  text-end"
					onClick={() => {
						deleteTask(index);
					}}>
					<FaCross />
				</div>
			</div>
		</li>
	));

	return (
		<div className="container">
			<div className="row">
				<div className="list-col mx-auto">
					<h1>List of : {props.name}</h1>
					<input
						className=" form-control"
						type="text"
						name="list"
						id="list"
						placeholder="Next scary thing to Do..."
						onKeyUp={e => {
							//that means that the key pressed is intro
							if (e.keyCode == 13) {
								// comprobar que no está vacío
								if (e.target.value) {
									//comprobar si el valor existe
									let newTask = {
										label: e.target.value,
										done: false
									};

									const myArr = list.map(x => {
										return x.label;
									});
									myArr.includes(e.target.value) == false
										? (addTask(newTask),
										  (e.target.value = ""))
										: swal(
												"The item is already on the scrry list!"
										  );
								} else {
									swal("Please add a scary task");
								}
							}
						}}
					/>
				</div>
			</div>
			<div className="row">
				<div className="list-col mx-auto">
					<ul className="list-group">{newLI}</ul>
				</div>
			</div>

			{/* this is the list counter */}
			<div className="row">
				<div className="list-col mx-auto">
					<ul className="list-group">
						{list.length == 0 ? (
							<li className="list-group-item">
								No scary tasks, add a new task!
							</li>
						) : (
							""
						)}
						<li className="list-group-item text-muted text-start counter">
							{list.length} Tasks left before death!
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

List.propTypes = {
	name: PropTypes.string
};
