import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Typography,
  ThemeProvider,
  Divider,
  Paper
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
export default function Calculation(): JSX.Element {
  const [dataName, setDataName] = React.useState('no file chosen');
  const [data, setData] = React.useState([[""]]);

  const [catPath, setCatPath] = React.useState('no file chosen');
  const [categories, setCategories] = React.useState([""]);


  const [result, setResult] = React.useState('');
  const [numCoders, setNumCoders] = React.useState(0);
  const [numSubjects, setNumSubjects] = React.useState('0');

  const [categoryList, setCategoryList] = React.useState([createCategory(0, 'None')]);
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
    pNominal, fNominal, fOrdinal, sNominal, sOrdinal, } = state;

  const onDataUploaded = (e: any): void => {
    setLinearProgress(false)
    
    if (e.target.files !== undefined && e.target.files[0] !== undefined) {
      setLinearProgress(true);
      setDataName(e.target.files[0].name);
      Papa.parse(e.target.files[0], {
        complete: (result: any) => {
          setData(result.data);
          console.log(result);
          setNumSubjects(result.data.length);
          if (result.data.length > 0) {
            setNumCoders(result.data[0].length);
          }
        },
        header: false
      })
      setLinearProgress(false);
    }

    

  };

  const onCategoriesUploaded = (e: any): void => {
    console.log("category uploading");
    setLinearProgress(false)
    if (e.target.files !== undefined && e.target.files[0] !== undefined) {
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



  const onReset = (): void => {
    setBackDrop(false);
    setDataName('no file chosen');
    setData([]);
    setCategories([]);
    setCatPath('no file chosen');
    setNumCoders(0);
    setNumSubjects('0');
    setCategoryList([createCategory(0, 'None')]);
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

  const checkInput = () => {
    let inputError = [];

    let valueArray = Object.values(state);
    if (!valueArray.includes(true)) {
      inputError.push("measure")
    }

    if (dataName === 'no file chosen') {
      inputError.push("data");
    }
    if (!multilabel && catPath === 'no file chosen') {
      inputError.push("categories");
    }

    let msg = inputError.join(', ');
    let result1 = "Missing input(s): ".concat(msg)
    setInputExistence(result1);
    if (inputError.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  const calculateMultilabel = () => {
    const N = data.length;
    var weightedSum = 0;
    
    var peMulti = 0;
    
    var coder1 : any = {};
    var coder2 : any = {};

    var M = data[0][0].toString().length;

    for (let j = 0; j < N; j++) {
      var numDiff = 0;
      for (let k = 0; k < M; k++) { // should take care of missing data, e.g., some entry with length smaller than M
        if (data[j][0][k] != data[j][1][k]) {
          numDiff += 1;
        }
      }
      let weight = 1 - numDiff / M;
      weightedSum += weight;
      if (data[j][0] in coder1) {
        coder1[data[j][0]] += 1;
      } else {
        coder1[data[j][0]] = 0;
      }
      if (data[j][1] in coder2) {
        coder2[data[j][1]] += 1;
      } else {
        coder2[data[j][1]] = 0;
      }
    }

    const list1 = Object.keys(coder1);
    const list2 = Object.keys(coder2);
    for (const c1 of list1) {
      for (const c2 of list2) {
        if ( (c1 in coder2) && (c2 in coder1) ) {
          numDiff = 0;
          for (let k = 0; k < M; k++) { // should take care of missing data, e.g., some entry with length smaller than M
            if (c1[k] != c2[k]) {
              numDiff += 1;
            }
          }
          let weight = 1 - numDiff / M;
          peMulti += weight * coder1[c1] * coder2[c2];
        }
      }
    }

    let pa = weightedSum / N;
    let pe = peMulti / (N * N);   
    let kappa = ((pa - pe) / (1 - pe)).toFixed(3);
    let result = "Multi-label Kappa: ";
    result = result.concat(kappa.toString(), "\n");

    setResult(result);
    setOpenResult(true);
    setBackDrop(false);
    return;
  }

  const calculate = () => {
    if (numCoders == 1) {
      // print some message
      console.log("There should be at least two coders.")
      return;
    }
    if (!checkInput()) {
      setOpenError(true);
      return;
    }
    
    setOpenError(false);
    setBackDrop(true);

    const N = data.length;
    var weightedSum = 0;
    
    var result = "";

    var peCohen = 0;
    var peWeighted = 0;
    var peScott = 0;
    var peScottW = 0;

    var pa;
    var pe;
    var kappa;
    
    var coder1 : any = {};
    var coder2 : any = {};

    if (multilabel) { // multilabel kappa has different input requirement
      calculateMultilabel();
      return;
    }

    const max = categories.length - 1;
    
    var same = 0;
    
    for (let k = 0; k <= max; k++) {
      coder1[categories[k]] = 0;
      coder2[categories[k]] = 0;
    }

    
    
    // Iterate through the given data and extract useful information
    // Assumption: there are two coders
    for (let j = 0; j < N; j++) {
      if (data[j][0] == data[j][1]) {
        same += 1;
      }
      
      let rank1 = categories.indexOf(data[j][0]);
      let rank2 = categories.indexOf(data[j][1]);
      if (rank1 != -1 && rank2 != -1) {
        let weight = 1 - Math.abs(rank1- rank2) / max;
        weightedSum += weight;
      }
      coder1[data[j][0]] += 1;
      coder2[data[j][1]] += 1;
    }

    

    for (let k = 0; k <= max; k++) {
      for (let j = 0; j <= max; j++) {
        let weight = 1 - (Math.abs(k - j)) / max;
        peWeighted += weight * coder1[categories[k]] * coder2[categories[j]];
        peScottW += weight * (coder1[categories[k]] + coder2[categories[k]]) * (coder1[categories[j]] + coder2[categories[j]]);
        if (k == j) {
          peCohen += coder1[categories[k]] * coder2[categories[j]];
          peScott += Math.pow(coder1[categories[k]] + coder2[categories[j]], 2);
        }
      }
    }


    if (cohen) {
      pa = same / N;
      pe = peCohen / (N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(3);
      result = result.concat("Cohen's Kappa: ", kappa.toString(), "\n")
    }
    if (weighted) {
      pa = weightedSum / N;
      pe = peWeighted / (N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(3);
      result = result.concat("Weighted Kappa: ", kappa.toString(), "\n")
    }
    if (pNominal) {
      pa = (same / N).toFixed(3);
      result = result.concat("Percentage Agreement: ", pa.toString(), "\n")
    }
    if (sNominal) {
      pa = same / N;
      pe = peScott / (4 * N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(3);
      result = result.concat("Scott's Pi: ", kappa.toString(), "\n")
    }
    if (sOrdinal) {
      pa = weightedSum / N;
      pe = peScottW / (4 * N * N);
      kappa = ((pa - pe) / (1 - pe)).toFixed(3);
      result = result.concat("Weighted Scott's Pi: ", kappa.toString(), "\n")

    }

    // If numCoders == 2 and fNominal or fOrdianl is chosen, invoke Scott's Pi's calculation
    if (kNominal || kOrdinal || fNominal || fOrdinal) {
      // Initialize 
      var R: any[][] = [];
      var RStar: any[][] = [];
      var Ri: number[] = new Array(N).fill(0);
      for (let i = 0; i < N; i++) {
        R.push(new Array(max+1).fill(0));
        RStar.push(new Array(max+1).fill(0));
      }

      var NP = N;
      var totalRatings = 0;
      for (let i = 0; i < N; i++) {
        var numRatings = 0;
        for (let j = 0; j < numCoders; j++) {
          let rank = categories.indexOf(data[i][j]);
          if (rank != -1) {
            R[i][rank] += 1;
            numRatings += 1;
            totalRatings += 1;
          }
        }
        Ri[i] = numRatings;
        if (numRatings < 2) {
          NP -= 1;
          totalRatings -= numRatings; // RBar: 1/np * sum over i through n prime, which only includes those items with two or more ratings
        }
      }
      for (let i = 0; i < N; i++) {
        for (let k = 0; k <= max; k++) {
          for (let l = 0; l <= max; l++) {
            let weight = 1 - Math.abs(k - l) / max;
            RStar[i][k] += weight * R[i][l];
          }
        }
      }

      var RBar = totalRatings / NP;

      var paKP = 0;
      var paKWP = 0;
      var paF = 0;
      var paFW = 0;
      var pi: number[] = new Array(max+1).fill(0);
      var piF: number[] = new Array(max+1).fill(0);
      for (let i = 0; i < NP; i++) {
        if (Ri[i] < 2) {
          continue;
        }
        var tempPaK = 0;
        var tempPaKW = 0;
        var tempPaF = 0;
        var tempPaFW = 0;
        for (let k = 0; k <= max; k++) {
          tempPaK += R[i][k] * (R[i][k] - 1); // assumption: Ri[i] >= 2; for nominal data, R = RStar
          tempPaKW += R[i][k] * (RStar[i][k] - 1); // assumption: Ri[i] >= 2
          tempPaF += R[i][k] * (R[i][k] - 1); // assumption: Ri[i] >= 2
          tempPaFW += R[i][k] * (RStar[i][k] - 1); // assumption: Ri[i] >= 2
         
          pi[k] += R[i][k];
          piF[k] += (R[i][k] / Ri[i]); // may cause imprecise results
        }
        tempPaK /= (Ri[i] - 1);
        tempPaKW /= (Ri[i] - 1);
        tempPaF /= (Ri[i] * (Ri[i] - 1));
        tempPaFW /= (Ri[i] * (Ri[i] - 1));

        paKP += tempPaK;
        paKWP += tempPaKW;
        paF += tempPaF;
        paFW += tempPaFW;
      }

      
      paKP = paKP / (NP * RBar);
      paKWP = paKWP / (NP * RBar);
      paF = paF / NP;
      paFW = paFW / NP;

      var paK = paKP * ( 1 - ( 1 / (NP * RBar) ) ) + ( 1 / (NP * RBar) );
      var paKW = paKWP * ( 1 - ( 1 / (NP * RBar) ) ) + ( 1 / (NP * RBar) );
      
      var peK = 0;
      var peKW = 0;
      var peF = 0;
      var peFW = 0;
      for (let k = 0; k <= max; k++) {
        for (let l = 0; l <= max; l++) {
          let weight = 1 - Math.abs(k - l) / max;
          peKW += weight * pi[k] * pi[l];
          peFW += weight * piF[k] * piF[l];
          if (k == l) {
            peK += pi[k] * pi[k];
            peF += piF[k] * piF[k];
          }
        }
      }
      peK = peK / Math.pow(NP * RBar, 2);
      peKW = peKW / Math.pow(NP * RBar, 2);
      peF = peF / Math.pow(N, 2);
      peFW = peFW / Math.pow(N, 2);


      var alpha;
      var fleiss;

      if (kNominal) {
        alpha = ((paK - peK) / (1 - peK)).toFixed(3);
        result = result.concat("Krippendorff's Alpha: ", alpha.toString(), "\n")

      }

      if (kOrdinal) {
        alpha = ((paKW - peKW) / (1 - peKW)).toFixed(3);
        result = result.concat("Weighted Krippendorff's Alpha: ",alpha.toString(), "\n")
      }
      
      
      if (fNominal) {
        fleiss = ((paF - peF) / (1 - peF)).toFixed(3);
        result = result.concat("Fleiss' Kappa: ", fleiss.toString(), "\n")
      }
      if (fOrdinal) {
        fleiss = ((paFW - peFW) / (1 - peFW)).toFixed(3);
        result = result.concat("Weighted Fleiss' Kappa: ", fleiss.toString(), "\n")
      }
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
            <Typography variant="subtitle1">
              Choose measure(s)
            </Typography>
          </Grid>

          <Grid item> 
          <Paper variant="elevation" elevation={3} style={{backgroundColor: 'inherit', margin: 10, minWidth: 500}}>
          <Typography  style={{margin: 10, color: 'gray'}}>
              For two coders
          </Typography>
          <Table size="small" aria-label="a dense table" style={{maxWidth: 500, margin: 10, minWidth: 0}}>
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
            

          </Paper>
          </Grid>

          <Grid item> 
          <Paper variant="elevation" elevation={3} style={{backgroundColor: 'inherit', margin: 10, minWidth: 500}}>
          <Typography  style={{margin: 10, color: 'gray'}}>
              For at least two coders
          </Typography>
          <Table size="small" aria-label="a dense table" style={{maxWidth: 500, margin: 10, minWidth: 0}}>
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
                    Fleiss' Kappa
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={fNominal} onChange={handleChange} name="fNominal" />
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Checkbox checked={fOrdinal} onChange={handleChange} name="fOrdinal" />
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>   

          </Paper>
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
              {!multilabel && <Grid item xs={12} sm={6}>
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
              </Grid>}
            </Grid>

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

        <Divider orientation="vertical" style={{margin: 5}}/>

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
              This section displays information extracted from the
              files uploaded in SETTINGS. Please make sure the files have
              the correct format described in File Format page.
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

              <Table size="small" aria-label="a dense table" style={{maxWidth: 400, margin: 5}}>
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
          </Grid>
          <div style={{ height: 180 }}> </div>
        </Grid>

      </Grid>

    </ThemeProvider >
  );
}
