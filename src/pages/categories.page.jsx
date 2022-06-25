import React, { useCallback, useMemo, useState } from 'react'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { colors, Stack, Grid, Box, Paper, InputLabel, Button, Typography, FormGroup, FormControl, FormHelperText, OutlinedInput } from '@mui/material'

import LayoutComponent from '../components/layout.component'
import CategoryComponent from '../components/category.component'
import DialogComponent from '../components/dialog.component'
import AlertComponent from '../components/alert.component'
import useCategories from '../hooks/useCategories'

const CategoriesPage = () => {
	const { categories, handleCreateCategory, handleDeleteCategory } = useCategories()
	const [disabled, setDisabled] = useState(false)
	const [deleteDialog, setDeleteDialog] = useState({
		open: false,
		id: '',
	})
	const handleOpenDeleteDialog = useCallback(
		(id) => {
			setDeleteDialog({
				open: true,
				id,
			})
		},
		[setDeleteDialog]
	)
	const handleCloseDeleteDialog = useCallback(() => {
		setDeleteDialog((prev) => ({ ...prev, open: false }))
	}, [setDeleteDialog])
	const initialValues = useMemo(
		() => ({
			name: '',
		}),
		[]
	)
	const validationSchema = yup.object().shape({
		name: yup.string().typeError('The name is invalid').required('The name is required'),
	})
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		enableReinitialize: true,
		onSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
			setDisabled(true)
			handleCreateCategory(values, setErrors, resetForm, setDisabled)
		},
	})
	return (
		<LayoutComponent>
			<DialogComponent open={deleteDialog.open} onClose={handleCloseDeleteDialog} deleteId={deleteDialog.id} handleDeleteDialog={handleDeleteCategory} setDeleteDialog={setDeleteDialog} title='Delete Category'>
				Are you sure you want to delete this category? You will not be able to recover this once deleted.
			</DialogComponent>
			<Stack spacing={4} width='100%'>
				<Grid container>
					<Grid item xs={12} sm={12} md={12} lg={8} xl={6}>
						<Paper elevation={0} sx={{ padding: '2rem', borderRadius: '1rem' }}>
							<Typography variant='h5' marginBottom='1.5rem' color={colors.grey[700]}>
								Create Category
							</Typography>
							<Box component='form' noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
								<Stack spacing={2}>
									<FormGroup>
										<InputLabel htmlFor='name' sx={{ marginBottom: '.25rem' }}>
											Name *
										</InputLabel>
										<FormControl required error={formik.touched.name && Boolean(formik.errors.name)} variant='standard' fullWidth>
											<OutlinedInput value={formik.values.name} onChange={formik.handleChange} id='name' sx={{ borderRadius: '.5rem' }} />
											<FormHelperText>{formik.touched.name && formik.errors.name}</FormHelperText>
										</FormControl>
									</FormGroup>
									<FormGroup>
										<Button
											variant='contained'
											size='large'
											type='submit'
											disableElevation
											disabled={disabled}
											sx={{
												width: {
													sm: '100%',
													md: '150px',
												},
												minHeight: '50px',
												borderRadius: '.5rem',
												color: 'background.default',
											}}
										>
											Create
										</Button>
									</FormGroup>
								</Stack>
							</Box>
						</Paper>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={12}>
						<Paper elevation={0} sx={{ padding: '2rem', borderRadius: '1rem' }}>
							<Typography variant='h5' color={colors.grey[700]}>
								All Categories
							</Typography>
							<Typography variant='body2' marginBottom='1.5rem' color={colors.grey[400]}>
								Lis of all categories that can be used to categorized a menu
							</Typography>
							{categories.length > 0 ? (
								<Grid container spacing={3}>
									{categories.map((category) => (
										<Grid item xs={12} sm={6} md={4} xl={3} key={category.id}>
											<CategoryComponent category={category} handleOpenDeleteDialog={handleOpenDeleteDialog} />
										</Grid>
									))}
								</Grid>
							) : (
								<AlertComponent severity='info'>There's no categories available.</AlertComponent>
							)}
						</Paper>
					</Grid>
				</Grid>
			</Stack>
		</LayoutComponent>
	)
}

export default CategoriesPage
