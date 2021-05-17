import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';

import {
  Grid,
  Typography,
  Link,
  ThemeProvider,
} from '@material-ui/core';

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

const shell = require('electron').shell

export default function Documentation(): JSX.Element {
  return <ThemeProvider theme={theme1} >
    <Grid container direction="column" justify="center" alignItems="flex-start" spacing={3}
          style={{overflow: 'auto', marginLeft: 20, marginRight: 20}}>
      <Grid item>
        <Typography variant="h5">
          About
        </Typography>
      </Grid>
      <Grid item>
        <Typography >This app determines the <Link onClick={() => shell.openExternal("https://en.wikipedia.org/wiki/Inter-rater_reliability")}>inter-coder reliability</Link> via various statistics. To calculate the inter-coder reliability, please first choose the statistics you would like to calculate and upload the required files.</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5">
          Statistics
        </Typography>
      </Grid>

      <Grid item>
        <Typography>
        We cover 6 types of statistics: Cohen's Kappa, Percentage Agreement, Krippendorff's Alpha, Scott's Pi, Fleiss' Kappa and Multi-label Kappa. Each of the first five statistics has a weighted counterpart, which is used for ordinal data. Below are references to these statistics' definitions we used when implementing the calculation.
        </Typography>
      </Grid>
      <Grid item container spacing={2} direction='column'>
      <Grid item>
        <Typography>
          1. Cohen's Kappa: <Link onClick={() => shell.openExternal("https://en.wikipedia.org/wiki/Cohen%27s_kappa")}>Wikipedia</Link>
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
        2. Percentage Agreement: Suppose some raters are assigning several predefined categories to a set of subjects in an experiment. If there are 2 raters, the Percentage Agreement is the number of subjects which are assigned the same category twice divided by the total number of subjects. If there are more than 2 raters, we calculate the Percentage Agreement for each pair of raters and then take the mean to be the final Percentage Agreement. <Link onClick={() => shell.openExternal("https://cehs01.unl.edu/aalbano/intromeasurement/mainch7.html")}>(more information)</Link>
        
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          3. Krippendorff's Alpha: <Link onClick={() => shell.openExternal("https://en.wikipedia.org/wiki/Krippendorff%27s_alpha")}>Wikipedia</Link>, <Link onClick={() => shell.openExternal("https://pypi.org/project/krippendorff/")}>Python Library</Link>    
        </Typography>
      </Grid>
      <Grid item>
        <Typography>4. Scotts’ Pi: <Link onClick={() => shell.openExternal("https://en.wikipedia.org/wiki/Scott%27s_Pi")}>Wikipedia</Link></Typography>
      </Grid>
      <Grid item>
        <Typography>        
          5. Fleiss' Kappa: Fleiss' Kappa is essentially Scott's Pi extended to handle more than 2 coders. The definition of Fleiss' Kappa is on <Link onClick={() => shell.openExternal("https://en.wikipedia.org/wiki/Fleiss%27_kappa")}>this webpage</Link>. We used the generalized formula documented <Link onClick={() => shell.openExternal("https://github.com/jmgirard/mReliability/wiki/Scott%27s-pi-coefficient")}>here</Link> to implement this statistic. 
        </Typography>

      </Grid>
      <Grid item>
        <Typography>
        6. Multi-label Kappa: Suppose some raters are assigning several predefined categories to a set of subjects in an experiment. In this case, a rater would examine multiple dimensions of each subject. For each dimension or feature, the rater would code 1 if he or she thinks a subject possesses that feature. So each subject can be coded as a binary vector such as (1, 0, 1), where each entry represents whether the subject has the corresponding feature. For example, when coding the sentiment of a given text, we would like to analyze whether the text reflects the following three emotions respectively: sadness, anger, happiness. If a rater assigns (1, 0, 0) to this text, then the rater considers this text to be sad, neither angry nor happy. The Multi-label Kappa can be treated as a weighted Kappa where the weights are calculated as the distance between different binary vectors.
        </Typography>
      </Grid>
      </Grid>
    </Grid>
  </ThemeProvider>
}
