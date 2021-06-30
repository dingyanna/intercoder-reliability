import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Typography,
  ThemeProvider,
  Divider,
} from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Calculation.global.css';
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const Papa = require('papaparse');

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

function createCategory(rank: number, category: any) {
  return {rank, category}
}
function createCatWeight(category: any, weight: any) {
  return {category, weight}
}
export default function Calculation(): JSX.Element {
  const [dataName, setDataName] = React.useState('no file chosen');
  const [data, setData] = React.useState([]);

  const [catPath, setCatPath] = React.useState('no file chosen');
  const [categories, setCategories] = React.useState([]);

  const [weights, setWeights] = React.useState('no file chosen');
  const [weightsPath, setWeightsPath] = React.useState('');

  const [result, setResult] = React.useState('');
  const [numCoders, setNumCoders] = React.useState('0');
  const [numSubjects, setNumSubjects] = React.useState('0');

  const [categoryList, setCategoryList] = React.useState([createCategory(0, 'None')]);
  const [weightsList, setWeightsList] = React.useState([createCatWeight('None', 'None')]);
  const [linearProgress, setLinearProgress] = React.useState(false);

  const [backDrop, setBackDrop] = React.useState(false);

  const [openResult, setOpenResult] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const [woWeights, setWoWeights] = React.useState(false);
  const [wWeights, setWWeights] = React.useState(false);

  const [inputExistence, setInputExistence] = React.useState("")

  const [state, setState] = React.useState({
    cohen: false,
    weighted: false,
    multilabel: false,
    kNominal: false,
    kOrdinal: false,
    pNominal: false,
    pOrdinal: false,
    fNominal: false,
    fOrdinal: false,
    sNominal: false,
    sOrdinal: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (["cohen", "sNominal", "kNominal",
      "fNominal", "pNominal", "multilabel"].includes(event.target.name)) {
      if (woWeights) {
        setWoWeights(false)
      }
    }
    if (["weithed", "fOrdinal", "kOrdinal",
      "pOrdinal", "sOrdinal"].includes(event.target.name)) {
      if (wWeights) {
        setWWeights(false)
      }
    }
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { cohen, weighted, multilabel, kNominal, kOrdinal,
    pNominal, pOrdinal, fNominal, fOrdinal, sNominal, sOrdinal, } = state;

  const onDataUploaded = (e: any): void => {
    console.log('upload data');
    setLinearProgress(false)
    setDataName(e.target.files[0].name);
    if (e.target.files !== undefined) {
      setLinearProgress(true);
      Papa.parse(e.target.files[0], {
        complete: (result: any) => {
          setData(result.data);
          console.log(result);
          setNumSubjects(result.data.length);
          setNumCoders(result.data[0].length);
        },
        header: false
      })
      setLinearProgress(false);
    }

    

  };

  const onCategoriesUploaded = (e: any): void => {
    console.log("category uploading");
    setLinearProgress(false)
    if (e.target.files !== undefined) {
      setLinearProgress(true)
      setCatPath(e.target.files[0].name);
      Papa.parse(e.target.files[0], {
        complete: (result: any) => {
          setCategories(result.data.flat());
          let tempList = []
          for (let i = 0; i < result.data.length; i++) {
            tempList.push(createCategory(i, result.data[i]));
          }
          setCategoryList(tempList);
        },
        header: false
      })
      setLinearProgress(false);
    }
    
    
    
  };

  // const onWeightsUploaded = (e: any): void => {
  //   setLinearProgress(false)
  //   if (e.target.files !== undefined) {
  //     setLinearProgress(true)
  //   }
  //   setWeights(e.target.files[0].name);
    
  //   Papa.parse(e.target.files[0], {
  //     complete: (result: any) => {
  //       setWeightsPath(result.data);
  //       console.log(result);
  //     },
  //     header: false
  //   })
  //   setLinearProgress(false);

  // };


  const onReset = (): void => {
    setDataName('no file chosen');
    setData([]);
    setCategories([]);
    setCatPath('no file chosen');
    setWeights('no file chosen');
    setNumCoders('0');
    setNumSubjects('0');
    setCategoryList([createCategory(0, 'None')]);
    setWeightsList([createCatWeight('None', 'None')]);
    setLinearProgress(false);
    setResult('');
    setOpenResult(false);
    setOpenError(false);
    setState({
      cohen: false,
      weighted: false,
      multilabel: false,
      kNominal: false,
      kOrdinal: false,
      pNominal: false,
      pOrdinal: false,
      fNominal: false,
      fOrdinal: false,
      sNominal: false,
      sOrdinal: false,
    });
    setWoWeights(false);
    setWWeights(false);
  };

  const checkWeighted = (): boolean => {

    if (wWeights || weighted || fOrdinal || pOrdinal || kOrdinal || sOrdinal) {
      return true;
    }
    return false;

  };

  const checkInput = () => {
    let inputError = [];

    let valueArray = Object.values(state);
    if (!valueArray.includes(true)) {
      inputError.push("measure")
    }

    if (dataName === 'no file chosen') {
      inputError.push("data");
    }
    if (catPath === 'no file chosen') {
      inputError.push("categories");
    }

    // if (checkWeighted() && weights === 'no file chosen') {
    //   inputError.push(" weights");
    // }
    let msg = inputError.join(', ');
    let result1 = "Missing input(s): ".concat(msg)
    setInputExistence(result1);
    if (inputError.length > 0) {
      return false;
    } else {
      return true;
    }
  }


  const calculate = () => {
    if (!checkInput()) {
      setOpenError(true);
      return;
    }
    setBackDrop(true);
    //let observedMatrix: number[][] = [];
    const max = categories.length - 1;
    var same = 0;
    var coder1 : any = {};
    var coder2 : any = {};
    for (let k = 0; k <= max; k++) {
      coder1[categories[k]] = 0;
      coder2[categories[k]] = 0;
    }
    console.log(coder1);
    console.log(coder2);

    const N = data.length;

    var weighted_sum = 0;
    
    for (let j = 0; j < N; j++) {
      if (data[j][0] == data[j][1]) {
        same += 1;
      }
      
      let rank1 = categories.indexOf(data[j][0]);
      let rank2 = categories.indexOf(data[j][1]);
      if (rank1 != -1 && rank2 != -1) {
        let weight = 1 - Math.abs(rank1- rank2) / max;
        weighted_sum += weight;
      }
      coder1[data[j][0]] += 1;
      coder2[data[j][1]] += 1;
    }
    console.log(coder1);
    console.log(coder2);
    var pa;
    var result = "";
    var pe_cohen = 0;
    var pe_weighted = 0;
    var pe_scott = 0;
    var pe_scott_w = 0;
    var pe = 0;
    var kappa;

    for (let k = 0; k <= max; k++) {
      for (let j = 0; j <= max; j++) {
        let weight = 1 - (Math.abs(k - j)) / max;
        pe_weighted += weight * coder1[categories[k]] * coder2[categories[j]];
        pe_scott_w += weight * (coder1[categories[k]] + coder2[categories[k]]) * (coder1[categories[j]] + coder2[categories[j]]);
        if (k == j) {
          pe_cohen += coder1[categories[k]] * coder2[categories[j]];
          pe_scott += Math.pow(coder1[categories[k]] + coder2[categories[j]], 2);
        }
      }
    }


    if (cohen) {
      pa = same / N;
      pe = pe_cohen / (N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(2);
      result = result.concat("Cohen's Kappa: ")
      result = result.concat(kappa.toString());
      result = result.concat("\n");
    }
    if (weighted) {
      pa = weighted_sum / N;
      pe = pe_weighted / (N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(2);
      result = result.concat("Weighted Kappa: ")
      result = result.concat(kappa.toString());
      result = result.concat("\n");
    }
    if (multilabel) {

    }
    if (pNominal) {
      pa = (same / N).toFixed(2);
      result = result.concat("Percentage Agreement: ")
      result = result.concat(pa.toString());
      result = result.concat("\n");
    }
    if (kNominal) {

    }
    if (kOrdinal) {

    }
    if (sNominal) {
      pa = same / N;
      pe = pe_scott / (4 * N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(2);
      result = result.concat("Scott's Pi: ")
      result = result.concat(kappa.toString());
      result = result.concat("\n");
    }
    if (sOrdinal) {
      pa = weighted_sum / N;
      pe = pe_scott_w / (4 * N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(2);
      result = result.concat("Weighted Scott's Pi: ")
      result = result.concat(kappa.toString());
      result = result.concat("\n");

    }
    if (fNominal) {

    }
    if (fOrdinal) {

    }
    setResult(result);
    setOpenResult(true);
    setBackDrop(false);
  
  }


  return (
    <ThemeProvider theme={theme1}>
      <Backdrop open={backDrop}>
        <CircularProgress />
      </Backdrop>
      <Grid container style={{ height: 800, }}
      >
        <Grid
          item
          container
          xs={6}
          direction="column"
          spacing={2}
        >

          <Grid item style={{ marginBottom: 10 }}>
            <Typography variant="h6" style={{ color: 'gray' }}>
              SETTINGS
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Choose measure(s)
            </Typography>
          </Grid>

          <Grid item>
          <Table size="small" aria-label="a dense table" style={{maxWidth: 500}}>
              <TableHead>
                <TableRow>
                  <TableCell>   </TableCell>
                  <TableCell>  Non-weighted </TableCell>
                  <TableCell>  Weighted </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Cohen's Kappa
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={cohen} onChange={handleChange} name="cohen" />
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={weighted} onChange={handleChange} name="weighted" />
                  </TableCell>
                </TableRow>
 

                <TableRow>
                  <TableCell component="th" scope="row">
                  Krippendorff's Alpha
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={kNominal} onChange={handleChange} name="kNominal" />
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={kOrdinal} onChange={handleChange} name="kOrdinal" />
                  </TableCell>
                </TableRow> 

                <TableRow>
                  <TableCell component="th" scope="row">
                  Scott's Pi
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={sNominal} onChange={handleChange} name="sNominal" />
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={sOrdinal} onChange={handleChange} name="sOrdinal" />
                  </TableCell>
                </TableRow>


                <TableRow>
                  <TableCell component="th" scope="row">
                    Fleiss' Kappa
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={fNominal} onChange={handleChange} name="fNominal" />
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={fOrdinal} onChange={handleChange} name="fOrdinal" />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Percentage Agreement
                  </TableCell>
                  <TableCell component='th' scope='row'>
                  <Checkbox checked={pNominal} onChange={handleChange} name="pNominal" />
                  </TableCell>
                  <TableCell component='th' scope='row'></TableCell>
                </TableRow> 

                <TableRow>
                  <TableCell component="th" scope="row">
                  Multi-label Kappa
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={multilabel} onChange={handleChange} name="multilabel" />
                  </TableCell>
                  <TableCell component='th' scope='row'></TableCell>
                </TableRow>

              </TableBody>
            </Table>
            </Grid>


          <div style={{ height: 40 }}> </div>

          
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6}>
                <input
                  type="file"
                  name="data"
                  id="data"
                  className="inputfile"
                  onChange={onDataUploaded}
                />
                <label
                  htmlFor="data" style={{ padding: 7, }}>
                  Upload Data
                </label>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: 'gray',
                    maxWidth: 180,
                    maxHeight: 30,
                    overflow: 'auto',
                  }}
                >
                  {dataName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  type="file"
                  name="categories"
                  id="categories"
                  className="inputfile"
                  onChange={onCategoriesUploaded}
                />
                <label
                  htmlFor="categories"
                  style={{ padding: 7, backgroundColor: 'light' }}
                >
                  Upload Categories
                </label>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: 'gray',
                    maxWidth: 180,
                    maxHeight: 30,
                    overflow: 'auto',
                  }}
                >
                  {catPath}
                </Typography>
              </Grid>
            </Grid>
            {/* {checkWeighted() && (
              <Grid item xs={12} sm={6}>
                <input
                  type="file"
                  name="weights"
                  id="weights"
                  className="inputfile"
                  onChange={onWeightsUploaded}
                />
                <label htmlFor="weights" style={{ padding: 7 }}
                >
                  Upload Weights
              </label>
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    noWrap
                    style={{
                      color: 'gray',
                      maxWidth: 180,
                      maxHeight: 30,
                      overflow: 'auto',
                    }}
                  >
                    {weights}
                  </Typography>
                </Grid>
              </Grid>
            )
            } */}

          <div style={{ height: 40 }}> </div>

          <Grid item container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                style={{ width: 180, backgroundColor: '#7986cb', }}
                onClick={onReset}
              >
                reset
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                style={{ width: 180, backgroundColor: '#7986cb', }}
                onClick={calculate}
              >
                calculate
              </Button>
            </Grid>
          </Grid>
          <div style={{ height: 100 }}> </div>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid
          item
          container
          xs={6}
          direction="column"
          justify="flex-start"
          spacing={3}
          style={{ marginLeft: 15 }}
        >
          <Grid item style={{ marginBottom: 10 }}>
            <Typography variant="h6" style={{ color: 'gray' }}>
              INFORMATION
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="subtitle1" style={{ color: 'gray' }}>
              This section displays the essential information extracted from the
              files uploaded in SETTINGS. Please confirm it before pressing CALCULATE.
              It is recommended to refer the documentation for requirements on
              the file format.
            </Typography>
          </Grid>
          {linearProgress && <LinearProgress></LinearProgress>}
          <Grid item style={{ maxHeight: 500, overflow: 'auto', marginTop: 15 }}>
            <Grid item style={{ marginBottom: 10 }}>
              <Typography variant="caption">
                * Results will be shown here
              </Typography>
              <Collapse in={openResult}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenResult(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <AlertTitle></AlertTitle>
                  <Typography
                    variant="subtitle1"
                    className="new_line"
                  >{result}</Typography>
                </Alert>
              </Collapse>
            </Grid>

            <Grid item style={{ marginBottom: 10 }}>
              <Collapse in={openError}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenError(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <AlertTitle>Error</AlertTitle>
                  <Typography
                    variant="subtitle1"
                    className="new_line"
                    style={{ marginLeft: 20 }}>{inputExistence}</Typography>
                </Alert>
              </Collapse>
            </Grid>

            <Grid item>
              <Typography variant="subtitle1">
                1. Number of Data Points: {numSubjects}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                2. Number of Coders: {numCoders}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="subtitle1">3. Categories:</Typography>

              <Table size="small" aria-label="a dense table" style={{maxWidth: 400}}>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {categoryList.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell component="th" scope="row">
                        {category.rank}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {category.category}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Typography variant="caption">
                Note: In the case of ordinal data, we calculate the weight matrix according to the above ranking of categories.
              </Typography>
            </Grid>
            {/* <Grid item>
              <Typography variant="subtitle1">3. Category to Weight:</Typography>
              <Table size="small" aria-label="a dense table" style={{maxWidth: 400}}>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {weightsList.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell component="th" scope="row">
                        {category.category}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {category.weight}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            </Grid> */}
          </Grid>
          <div style={{ height: 180 }}> </div>
        </Grid>

      </Grid>

    </ThemeProvider >
  );
}
