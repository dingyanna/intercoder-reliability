import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';

import {
  Grid,
  Typography,
  Link,
  ThemeProvider,
  Paper
} from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
const theme1 = createMuiTheme({
  palette: {
    primary: {
      main: '#7986cb',
    },
    secondary: {
      main: '#9fa8da',
    },
  },
});

const cellStyle = {borderWidth: 2, borderStyle: 'solid', borderColor: 'gray'};

export default function FileFormat(): JSX.Element {
  return <ThemeProvider theme={theme1} >
    <Grid container 
          direction="column" 
          justify="center" 
          alignItems="flex-start" 
          spacing={3}
          style={{overflow: 'auto', marginLeft: 20, marginRight: 30}}>
      
      
      <Grid item>
      <Typography>
        The calculation requires two input files (i.e., data and categories), except for multi-label kappa which only needs data.
        The data file is a spreadsheet, where the ij-entry is the category assigned by coder j to the ith data point.
        Such a spreadsheet can be stored as either csv or txt files.

        The input file for categories is a column listing each label.

        Both input files do not have any headers or the column of indices.
      </Typography>
      </Grid>  
      <Grid item>
        <Typography variant="h6">
         General Example
        </Typography>
        
      </Grid>
      <Grid item>
      <Typography>
        
        Suppose there are three coders labeling five data points with the following categories: A, B, C. The data 
        is a table with three columns and five rows and the category file is a single column with three entries.
        Assume the chosen method is not multi-label kappa.
      </Typography>
      </Grid>  
      <Grid item>
      <Typography>
      Data:
      </Typography>
      </Grid>
      <Grid item>
      <Table size="small" style={{display: 'flex'}}>
              
        <TableBody>
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
              A
            </TableCell>
            <TableCell align="center"  style={cellStyle} component='th' scope='row'>
              B
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
              A
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center"  style={cellStyle} component="th" scope="row">
            C
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            C
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            C 
            </TableCell>
          </TableRow> 
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            C
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            C
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            A
            </TableCell>
          </TableRow> 
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            C
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            B
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            C 
            </TableCell>
          </TableRow> 
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            A
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            C
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            C 
            </TableCell>
          </TableRow> 
        </TableBody>
          </Table>
      
      </Grid>

      <Grid item>
      <Typography>
        Categories:
      </Typography>
      </Grid>  
      <Grid item>
      <Table size="small" style={{display: 'flex'}}>
              
        <TableBody>
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
              A
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
              B
            </TableCell>
          </TableRow> 
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
              C
            </TableCell>
          </TableRow> 

        </TableBody>
       </Table>
            
      </Grid>

      <Grid item>
        <Typography variant="h6">
         Example for Multi-label kappa 
        </Typography>
        
      </Grid>
      <Grid item>
        <Typography>
          Suppose there are three categories A, B and C and two coders labeling five data points. 
          Each coder decides whether the data belongs to A, B, and C, respectively.
          For instance, if a coder 
          classifies some data point as both class A and class B, the coder should label this data as 110.
          In this case, the calculator assumes the uploaded data file is a 
          spreadsheet with five rows and two columns, where each entry is a 0-1 vector with length 3.
        </Typography>
      </Grid>

      <Grid item>
      <Table size="small" style={{display: 'flex'}}>
              
        <TableBody>
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            010
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            110
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            110
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            110
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            001
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            101
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            101
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            100
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" style={cellStyle} component="th" scope="row">
            100
            </TableCell>
            <TableCell align="center" style={cellStyle} component='th' scope='row'>
            100
            </TableCell>
          </TableRow>
         

        </TableBody>
       </Table>
            
      </Grid>


    </Grid>
  </ThemeProvider>
}
