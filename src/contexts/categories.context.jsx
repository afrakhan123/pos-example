import React, { useState, useEffect, createContext } from 'react'
import { lowerCase } from 'lodash'
import { ref, set, get, remove, query, orderByChild, equalTo } from 'firebase/database'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { db } from '../firebase'
import { router } from '../router'
import SnackbarComponent from '../components/snackbar.component'

const CategoriesContext = createContext({})

export const CategoriesProvider = ({ children }) => {
	const [snackbar, setSnackbar] = useState({
		open: false,
		severity: 'info',
		message: '',
	})
	const [categories, setCategories] = useState([])
	const [keyword, setKeyword] = useState('')
	const handleError = (e) => {
		console.log(e)
		setSnackbar({
			open: true,
			severity: 'error',
			message: 'Oops! something went wrong',
		})
	}
	const handleSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }))
	}
	const handleCreateCategory = (values, setErrors, resetForm, setDisabled) => {
		values.id = uuidv4()
		values.createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
		values.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
		get(query(ref(db, router.categories.path), orderByChild('name'), equalTo(values.name)))
			.then((snapshot) => {
				if (snapshot.exists()) {
					setDisabled(false)
					setErrors({ name: 'The category is already exists' })
				} else {
					set(ref(db, `${router.categories.path}/${values.id}`), values)
						.then(() => {
							setDisabled(false)
							setSnackbar({
								open: true,
								severity: 'success',
								message: 'Successfully created a category',
							})
							resetForm()
						})
						.catch(handleError)
				}
			})
			.catch(handleError)
	}
	const handleDeleteCategory = (id, setDeleteDialog) => {
		get(ref(db, `${router.categories.path}/${id}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					remove(ref(db, `${router.categories.path}/${id}`))
						.then(() => {
							setDeleteDialog(false)
							setSnackbar({
								open: true,
								severity: 'warning',
								message: 'Successfully deleted a category',
							})
						})
						.catch(handleError)
				} else {
					setDeleteDialog(false)
					setSnackbar({
						open: true,
						severity: 'error',
						message: "Category doesn't exists",
					})
				}
			})
			.catch(handleError)
	}
	const handleSearchCategory = (keyword) => {
		setKeyword(lowerCase(keyword))
	}
	useEffect(() => {
		get(query(ref(db, router.categories.path), orderByChild('createdAt')))
			.then((snapshot) => {
				const data = []
				if (snapshot.exists()) {
					if (keyword) {
						snapshot.forEach((snap) => {
							const value = snap.val()
							Object.keys(value)
								.filter((field) => {
									return ['createdAt', 'updatedAt'].indexOf(field) === -1
								})
								.forEach((field) => {
									const isAlreadyInData = data.find((item) => item.id === value.id)
									const isMatchKeyword = lowerCase(value[field]).match(keyword)
									if (!isAlreadyInData && isMatchKeyword) {
										data.push(value)
									}
								})
						})
					} else {
						snapshot.forEach((snap) => {
							data.push(snap.val())
						})
					}
				}
				setCategories(data)
			})
			.catch(handleError)
	}, [categories, keyword])
	return (
		<CategoriesContext.Provider value={{ categories, handleCreateCategory, handleDeleteCategory, handleSearchCategory }}>
			<SnackbarComponent open={snackbar.open} onClose={handleSnackbar} severity={snackbar.severity}>
				{snackbar.message}
			</SnackbarComponent>
			{children}
		</CategoriesContext.Provider>
	)
}

export default CategoriesContext
