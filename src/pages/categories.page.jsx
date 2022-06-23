import React, { useCallback, useState } from 'react'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { styled, colors, Stack, Grid, Box, Paper, InputLabel, Button, Typography } from '@mui/material'
import MuiTextField from '@mui/material/TextField'

import { categories } from '../data'
import LayoutComponent from '../components/layout.component'
import CategoryComponent from '../components/category.component'
import DialogComponent from '../components/dialog.component'

const TextField = styled(MuiTextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		borderRadius: '.5rem',
	},
	'& .MuiFormHelperText-root': {
		marginLeft: 0,
	},
}))

const CategoriesPage = () => {
	const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false)
	const handleDeleteDialog = useCallback(() => {
		setOpenDeleteCategoryDialog(false)
		alert()
	}, [])
	const handleOpenDeleteCategoryDialog = useCallback(() => {
		setOpenDeleteCategoryDialog(true)
	}, [setOpenDeleteCategoryDialog])
	const handleCloseDeleteCategoryDialog = useCallback(() => {
		setOpenDeleteCategoryDialog(false)
	}, [setOpenDeleteCategoryDialog])
	const initialValues = {
		name: '',
	}
	const validationSchema = yup.object().shape({
		name: yup.string().typeError('The name is invalid').required('The name is required'),
	})
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit(values) {
			console.log(values)
		},
	})
	return (
		<LayoutComponent>
			<DialogComponent open={openDeleteCategoryDialog} onClose={handleCloseDeleteCategoryDialog} handleDeleteDialog={handleDeleteDialog} title='Are you sure?'>
				Do you really want to delete? If you proceed this item will not be able to get back this forever.
			</DialogComponent>
			<Stack spacing={4} width='100%'>
				<Grid container>
					<Grid item xs={12} sm={12} md={12} lg={8} xl={6}>
						<Paper elevation={0} sx={{ padding: '2rem', borderRadius: '1rem' }}>
							<Typography variant='h5' marginBottom='1.5rem' color={colors.grey[700]}>
								Create Category
							</Typography>
							<form onSubmit={formik.handleSubmit}>
								<Box paddingBottom='1rem'>
									<InputLabel htmlFor='name' sx={{ marginBottom: '.25rem' }}>
										Name *
									</InputLabel>
									<TextField id='name' variant='outlined' name='name' value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} fullWidth />
								</Box>
								<Button
									variant='contained'
									size='large'
									type='submit'
									disableElevation
									sx={{
										minWidth: '150px',
										minHeight: '50px',
										borderRadius: '.5rem',
										color: 'background.default',
									}}
								>
									Save
								</Button>
							</form>
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
							<Grid container spacing={3}>
								{categories.map((category) => (
									<Grid item xs={12} sm={6} md={4} xl={3} key={category.id}>
										<CategoryComponent name={category.name} handleOpenDeleteCategoryDialog={handleOpenDeleteCategoryDialog} />
									</Grid>
								))}
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Stack>
		</LayoutComponent>
	)
}

export default CategoriesPage
