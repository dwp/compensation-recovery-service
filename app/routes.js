const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

const radioButtonRedirect = require('radio-button-redirect')
const { NULL } = require('node-sass')
router.use(radioButtonRedirect)





// GET SPRINT NAME - useful for relative templates
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    req.folder = req.originalUrl.split('/')[1]; //folder, e.g. 'current'
    req.subfolder = req.originalUrl.split('/')[2]; //sub-folder e.g. 'service'
    res.locals.folder = req.folder; // what folder the url is
    res.locals.subfolder = req.subfolder; // what subfolder the URL is in
  console.log('folder : ' + res.locals.folder + ', subfolder : ' + res.locals.subfolder  );
    console.log('previous page is: ' + res.locals.prevURL + " and current page is " + req.url + " " + res.locals.currentURL );
    next();
  });

// Old routes, no longer used? (will need backslash in path to work)
router.use('/current', require('./views/current/_routes'));
router.use('/v4', require('./views/v4/_routes'));
router.use('/v3', require('./views/v3/_routes'));
router.use('/v2-compensators', require('./views/v2-compensators/_routes'));
router.use('/v1-compensators', require('./views/v1-compensators/_routes'));
router.use('/v1-staff', require('./views/v1-staff/_routes'));
router.use('/mvp', require('./views/mvp/_routes'));
router.use('/mvp-01', require('./views/mvp-01/_routes'));
router.use('/beta-v3-mvp', require('./views/beta-v3-mvp/_routes'));

// This route in use
router.use('/beta-v4', require('./views/beta-v4/\_routes'));

// BETA-V4 routing (these need adding to the beta-v4 routes file sometime)

// Start happy path and set venue default
router.post('/beta-v4/registration/nhs-guard-route', function (req, res) {

  // Check outcome of the NHS guard question
  if (req.session.data['treatment'] == 'Yes') {
    res.redirect('/beta-v4/registration/nhs-no')
  } else if (req.session.data['treatment'] == 'No') {
    req.session.data['backtocheckanswers'] = 'false'
    req.session.data['ip-check-answers'] = 'false'
    req.session.data['injuryVar'] = 'false'
    // Set manual address vars, enables check answers to return to correct address page
    req.session.data['manualAddress'] = 'false'
    req.session.data['manualAddressRep'] = 'false'
    res.redirect('/beta-v4/registration/liability-guard')
  }
})
router.post('/beta-v4/nhs-claim/nhs-guard-route', function (req, res) {

if (req.session.data['other-injuries'] == 'Yes' && req.session.data['treatment'] == 'No') {
  res.redirect('/beta-v4/nhs-claim/injury-no-hospital')
} else if (req.session.data['other-injuries'] == 'No' && req.session.data['treatment'] == 'No' || req.session.data['treatment'] == 'Not yet known') {
      res.redirect('/beta-v4/nhs-claim/about-the-injured-persons-rep')
  } else {
      res.redirect('/beta-v4/nhs-claim/hospital')
    }
})

// Routing for Liability > About the injured person
router.post('/beta-v4/registration/about-the-injured-person', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/registration/check-answers')
  }
  else {
    res.redirect('/beta-v4/registration/about-the-injured-person')
  }
})


// Routing for Injured persons address > Date of claim
router.post('/beta-v4/registration/date-of-claim', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['ip-check-answers'] == 'true') {
    req.session.data['ip-check-answers'] = 'false'
    // Redirects to interstitial check answers page
    res.redirect('/beta-v4/registration/check-answers-ip')
  }
  else {
    res.redirect('/beta-v4/registration/date-of-claim')
  }
})


// Routing for Date of injury > Whiplash guard
router.post('/beta-v4/registration/whiplash-guard', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/registration/check-answers')
  }
  else {
    res.redirect('/beta-v4/registration/whiplash-guard')
  }
})

// Routing for Whiplash question > Any other injury
router.post('/beta-v4/registration/injury-guard', function (req, res) {

  // check for no/no situation with whiplash and other injuries, and redirect to error page
  if(req.session.data['whiplash'] == 'No' && req.session.data['other-injuries'] == 'No') {
    res.redirect('/beta-v4/registration/whiplash-guard-error')
  } else if(req.session.data['whiplash'] == 'Yes' || req.session.data['other-injuries'] == 'Yes' || req.session.data['other-injuries'] == undefined) {
    // If coming from check answers page then return there after clicking continue
    if (req.session.data['backtocheckanswers'] == 'true') {
      req.session.data['backtocheckanswers'] = 'false'
      res.redirect('/beta-v4/registration/check-answers')
    } else {
      res.redirect('/beta-v4/registration/injury-guard')
    }
  }
})

// Routing for Any other injury > routes
router.post('/beta-v4/registration/other-injuries-route', function (req, res) {

  // check for no/no situation with whiplash and other injuries, and redirect to error page
  if(req.session.data['whiplash'] == 'No' && req.session.data['other-injuries'] == 'No') {
    res.redirect('/beta-v4/registration/injury-guard-error')
  } else if(req.session.data['whiplash'] == 'Yes' || req.session.data['other-injuries'] == 'Yes') {

    const otherInjuries = req.session.data['other-injuries']

    // If coming from check answers page then return there after clicking continue
    if (req.session.data['backtocheckanswers'] == 'true') {

      if (otherInjuries == 'Yes') {
        req.session.data['injuryVar'] = 'true'
        res.redirect('/beta-v4/registration/other-injuries')
      } else {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/registration/check-answers')
      }
    } else {
      if (otherInjuries == 'Yes') {
        res.redirect('/beta-v4/registration/other-injuries')
      } else {
        // Will need to flag error if Whiplash is also set to No
        res.redirect('/beta-v4/registration/about-the-injured-persons-rep')
      }
    }

  }
})

router.post('/beta-v4/nhs-claim/other-injuries-route', function (req, res) {

  // check for no/no situation with whiplash and other injuries, and redirect to error page
  if(req.session.data['whiplash'] == 'No' && req.session.data['other-injuries'] == 'No') {
    res.redirect('/beta-v4/nhs-claim/injury-guard-error')
  } else if(req.session.data['whiplash'] == 'Yes' || req.session.data['other-injuries'] == 'Yes') {

    const otherInjuries = req.session.data['other-injuries']

    // If coming from check answers page then return there after clicking continue
    if (req.session.data['backtocheckanswers'] == 'true') {

      if (otherInjuries == 'Yes') {
        req.session.data['injuryVar'] = 'true'
        res.redirect('/beta-v4/nhs-claim/other-injuries')
      } else {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/nhs-claim/check-answers')
      }
    } else {
      if (otherInjuries == 'Yes') {
        res.redirect('/beta-v4/nhs-claim/other-injuries')
      } else {
        // Will need to flag error if Whiplash is also set to No
        res.redirect('/beta-v4/nhs-claim/nhs-guard')
      }
    }

  }
})

// Routing for Any other injury > routes
// router.post('/beta-v4/registration/other-injuries-route', function (req, res) {
//
//   const otherInjuries = req.session.data['other-injuries']
//
//   // If coming from check answers page then return there after clicking continue
//   if(req.session.data['backtocheckanswers'] == 'true') {
//
//     if (otherInjuries == 'Yes') {
//       req.session.data['injuryVar'] = 'true'
//       res.redirect('/beta-v4/registration/other-injuries')
//     } else {
//       req.session.data['backtocheckanswers'] = 'false'
//       res.redirect('/beta-v4/registration/check-answers')
//     }
//   }
//   else {
//     if (otherInjuries == 'Yes') {
//       res.redirect('/beta-v4/registration/other-injuries')
//     } else {
//       // Will need to flag error if Whiplash is also set to No
//       res.redirect('/beta-v4/registration/about-the-injured-persons-rep')
//     }
//
//   }
// })


// Routing for Physical injury
router.post('/beta-v4/registration/where-is-the-injury', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/registration/check-answers')
  }
  else {
    res.redirect('/beta-v4/registration/where-is-the-injury')
  }
})

// Routing for Other injuries check boxes
router.post('/beta-v4/registration/where-is-the-injury-route', function (req, res) {

  const injury = req.session.data['injury']

  if (injury) {

    // Check and remove _unchecked value
    for (var i = injury.length; i--;) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }

    if (injury[0] == 'Physical injury other than whiplash') {
      res.redirect('/beta-v4/registration/where-is-the-injury')
    } else if (injury[0] == 'Psychological') {
      res.redirect('/beta-v4/registration/psychological')
    } else if (injury[0] == 'Neurological') {
      res.redirect('/beta-v4/registration/neurological')
    } else {
      // do nothing
      res.redirect('/beta-v4/registration/other-injuries')
    }

  }
})

// Routing for Physical injury
router.post('/beta-v4/nhs-claim/where-is-the-injury', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/nhs-claim/check-answers')
  }
  else {
    res.redirect('/beta-v4/nhs-claim/where-is-the-injury')
  }
})

// Routing for Other injuries check boxes
router.post('/beta-v4/nhs-claim/where-is-the-injury-route', function (req, res) {

  const injury = req.session.data['injury']

  if (injury) {

    // Check and remove _unchecked value
    for (var i = injury.length; i--;) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }

    if (injury[0] == 'Physical injury other than whiplash') {
      res.redirect('/beta-v4/nhs-claim/where-is-the-injury')
    } else if (injury[0] == 'Psychological') {
      res.redirect('/beta-v4/nhs-claim/psychological')
    } else if (injury[0] == 'Neurological') {
      res.redirect('/beta-v4/nhs-claim/neurological')
    } else {
      // do nothing
      res.redirect('/beta-v4/nhs-claim/other-injuries')
    }

  }
})


// Routing for Other injuries check boxes
// router.post('/beta-v4/registration/where-is-the-injury-route', function (req, res) {
//
//   const injury = req.session.data['injury']
//
//   if (injury) {
//
//     // Check and remove _unchecked value
//     for (var i = injury.length; i--;) {
//       if (injury[i] === '_unchecked') {
//         injury.splice(i, 1);
//       }
//     }
//
//     // If coming from check answers page then return there after clicking continue
//     if (req.session.data['backtocheckanswers'] == 'true') {
//       req.session.data['backtocheckanswers'] = 'false'
//       res.redirect('/beta-v4/registration/check-answers')
//     } else {
//       if (injury[0] == 'Physical injury other than whiplash') {
//         res.redirect('/beta-v4/registration/where-is-the-injury')
//       } else if (injury[0] == 'Psychological') {
//         res.redirect('/beta-v4/registration/psychological')
//       } else if (injury[0] == 'Neurological') {
//         res.redirect('/beta-v4/registration/neurological')
//       } else {
//         res.redirect('/beta-v4/registration/other-injuries')
//       }
//
//     }
//     // Else to flag error
//   }
// })

// Physical injury details routing
router.post('/beta-v4/registration/injury-physical-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On physical injury page
    if (injury[1] == 'Psychological') {
      res.redirect('/beta-v4/registration/psychological')
    } else if (injury[1] == 'Neurological') {
      res.redirect('/beta-v4/registration/neurological')
    } else {

      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/registration/check-answers')
      } else {
        res.redirect('/beta-v4/registration/about-the-injured-persons-rep')
      }
    }

})

router.post('/beta-v4/nhs-claim/injury-physical-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On physical injury page
    if (injury[1] == 'Psychological') {
      res.redirect('/beta-v4/nhs-claim/psychological')
    } else if (injury[1] == 'Neurological') {
      res.redirect('/beta-v4/nhs-claim/neurological')
    } else {

      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/nhs-claim/check-answers')
      } else {
        res.redirect('/beta-v4/nhs-claim/nhs-guard')
      }
    }

})

// Psychological injury details routing
router.post('/beta-v4/registration/injury-psychological-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On psychological injury page
    if (injury[1] == 'Neurological' || injury[2] == 'Neurological') {
      res.redirect('/beta-v4/registration/neurological')
    } else {
      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/registration/check-answers')
      } else {
        res.redirect('/beta-v4/registration/about-the-injured-persons-rep')
      }
    }
})

// Psychological injury details routing
router.post('/beta-v4/nhs-claim/injury-psychological-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On psychological injury page
    if (injury[1] == 'Neurological' || injury[2] == 'Neurological') {
      res.redirect('/beta-v4/nhs-claim/neurological')
    } else {
      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/nhs-claim/check-answers')
      } else {
        res.redirect('/beta-v4/nhs-claim/nhs-guard')
      }
    }
})


// Routing for Neurological > About IP rep
router.post('/beta-v4/registration/about-the-injured-persons-rep', function (req, res) {
  // If coming from check answers page then return there after clicking continue or continue as normal journey
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/registration/check-answers')
  } else {
    res.redirect('/beta-v4/registration/about-the-injured-persons-rep')
  }
})

// Routing for about the injured person rep > representative-address
router.post('/beta-v4/registration/representative-address', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/registration/check-answers')
  }
  else {
    res.redirect('/beta-v4/registration/representative-address')
  }
})

router.post('/beta-v4/nhs-claim/nhs-guard', function (req, res) {
  // If coming from check answers page then return there after clicking continue or continue as normal journey
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/nhs-claim/check-answers')
  } else {
    res.redirect('/beta-v4/nhs-claim/nhs-guard')
  }
})

// Routing for about the injured person rep > representative-address
router.post('/beta-v4/registration/representative-address', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/registration/check-answers')
  }
  else {
    res.redirect('/beta-v4/registration/representative-address')
  }
})

// Routing for about the injured person rep > representative-address
router.post('/beta-v4/nhs-claim/representative-address', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/nhs-claim/check-answers')
  }
  else {
    res.redirect('/beta-v4/nhs-claim/representative-address')
  }
})

// Routing for about the injured person rep address > reference
router.post('/beta-v4/registration/compensator-reference', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/registration/check-answers')
  }
  else {
    res.redirect('/beta-v4/registration/compensator-reference')
  }
})

router.post('/beta-v4/nhs-claim/compensator-reference', function (req, res) {
  // If coming from check answers page then return there after clicking continue
  if(req.session.data['backtocheckanswers'] == 'true') {
    req.session.data['backtocheckanswers'] = 'false'
    res.redirect('/beta-v4/nhs-claim/check-answers')
  }
  else {
    res.redirect('/beta-v4/nhs-claim/compensator-reference')
  }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_2/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_2/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_2/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_3/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_3/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_3/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmed')
    }
})


router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test1/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test1/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test1/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test2/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test2/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test2/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test3/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test3/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test3/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test4/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test4/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_4/test4/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t1/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t1/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t1/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t2/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t2/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t2/confirmed')
    }
})


router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t3/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t3/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t3/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t4/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t4/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t4/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t5/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t5/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t5/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t6/extra-info-route', function (req, res) {

if (req.session.data['info'] == '') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t6/extra-info')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_t6/confirmed')
    }
})



router.post('/beta-v4/account-management/standard-user/settlement-date-check', function (req, res) {

if (req.session.data['type-of-settlement'] == 'Claim withdrawn or unsuccessful') {
  res.redirect('/beta-v4/account-management/standard-user/settlement-confirm2')
  } else {
      res.redirect('/beta-v4/account-management/standard-user/settlement-date')
    }
})

router.post('/beta-v4/account-management/standard-user/retro-settle/settlement-date-check', function (req, res) {

if (req.session.data['type-of-settlement'] == 'Claim withdrawn or unsuccessful') {
  res.redirect('/beta-v4/account-management/standard-user/retro-settle/settlement-confirm2')
  } else {
      res.redirect('/beta-v4/account-management/standard-user/retro-settle/settlement-date')
    }
})

router.post('/beta-v4/cru-ops-service/claim-update/change-details-route', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/claim-update/liability-guard2')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/claim-update/change-injured-person')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/claim-update/change-injury-details')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/claim-update/change-treatment-details')
  } else {
      res.redirect('/beta-v4/cru-ops-service/claim-update/change-rep-details')
    }
})

router.post('/beta-v4/cru-ops-service/claim-update2/change-details-route', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/claim-update2/liability-guard2')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/claim-update2/change-injured-person')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/claim-update2/change-injury-details')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/claim-update2/change-treatment-details')
  } else {
      res.redirect('/beta-v4/cru-ops-service/claim-update2/change-rep-details')
    }
})

router.post('/beta-v4/cru-ops-service/claim-update3/change-details-route', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/claim-update3/liability-guard2')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/claim-update3/change-injured-person')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/claim-update3/change-injury-details')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/claim-update3/change-treatment-details')
  } else {
      res.redirect('/beta-v4/cru-ops-service/claim-update3/change-rep-details')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/reminders_1_0/reminder-route', function (req, res) {

if (req.session.data['reminder'] == 'reopen') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/reminders_1_0/confirmation_reopened')
} else if (req.session.data['reminder'] == 'extend') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/reminders_1_0/confirmation_extended')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/reminders_1_0/confirmation_cancelled')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/action-options', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmation_reminder')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/action-options2', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/check-answers-update2t')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmation_reminder')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed-check', function (req, res) {

if (req.session.data['task_decision'] == 'reject') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed_rej')
} else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed-check2', function (req, res) {

if (req.session.data['task_decision'] == 'reject') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed_rej2')
} else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed2')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed-check3', function (req, res) {

if (req.session.data['task_decision'] == 'reject') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed_rej3')
} else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed3')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/action-options', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_reminder')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/reminder-route', function (req, res) {

if (req.session.data['reminder'] == 'reopen') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_reopened')
} else if (req.session.data['reminder'] == 'extend') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_extended')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_cancelled')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/action-options', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/decision2')
} else if (req.session.data['change'] == 'message') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/confirmation-message')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/result')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/action-options2', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_reminder')
} else if (req.session.data['change'] == 'new') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/actions')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/result-route', function (req, res) {

if (req.session.data['result'] == 'fully') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/cont_neg')
} else if (req.session.data['result'] == 'disallowed') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/confirmation-dis')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/confirmation-with')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/result-route2', function (req, res) {

if (req.session.data['result'] == 'withdrawn') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/confirmation-with2')
} else if (req.session.data['result'] == 'disallowed') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/confirmation-dis2')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/check-answers-update-rev')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/action-options2', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_reminder')
} else if (req.session.data['change'] == 'new') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/actions')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/action-options2', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/confirmation_reminder')
} else if (req.session.data['change'] == 'new') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/actions')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/calc_engine_main/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/result-route', function (req, res) {

if (req.session.data['result'] == 'fully') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/cont_neg')
} else if (req.session.data['result'] == 'disallowed') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/confirmation-dis')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/confirmation-with')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/result-route2', function (req, res) {

if (req.session.data['result'] == 'withdrawn') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/confirmation-with2')
} else if (req.session.data['result'] == 'disallowed') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/decision_reason_other')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/check-answers-update-rev')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/result-route2', function (req, res) {

if (req.session.data['result'] == 'withdrawn') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/confirmation-with2')
} else if (req.session.data['result'] == 'disallowed') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/decision_reason_other')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/check-answers-review')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/action-options', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/decision2')
} else if (req.session.data['change'] == 'message') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/confirmation-message')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_1/result')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/action-options', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/decision2')
} else if (req.session.data['change'] == 'message') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/confirmation-message')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_2/result')
    }
})

router.post('/beta-v4/account-management-dsa/dsa2/dsa-decision', function (req, res) {

if (req.session.data['result'] == 'withdrawn') {
  res.redirect('/beta-v4/account-management-dsa/dsa2/forward-dsa')
} else if (req.session.data['result'] == 'disallowed') {
    res.redirect('/beta-v4/account-management-dsa/dsa2/confirmation_later')
    } else {
      res.redirect('/beta-v4/account-management-dsa/dsa2/confirmation_signed.html')
    }
})

router.post('/beta-v4/account-management-dsa/dsa/dsa-decision', function (req, res) {

if (req.session.data['result'] == 'withdrawn') {
  res.redirect('/beta-v4/account-management-dsa/dsa/forward-dsa')
} else if (req.session.data['result'] == 'disallowed') {
    res.redirect('/beta-v4/account-management-dsa/dsa/data-contact-holding_b')
    } else {
      res.redirect('/beta-v4/account-management-dsa/dsa/data-contact-holding_c.html')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/reminder-options', function (req, res) {

if (req.session.data['info'] == 'reminder') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/confirmation_reminder')
    } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/nhs_review_v1_0/confirmation2')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0/action-options2', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0/confirmation_reminder')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/action-options2', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/confirmation_reminder')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/other-injuries-route', function (req, res) {

  // check for no/no situation with whiplash and other injuries, and redirect to error page
  if(req.session.data['other-injuries'] == 'No') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
  } else if(req.session.data['whiplash'] == 'Yes' || req.session.data['other-injuries'] == 'Yes') {

    const otherInjuries = req.session.data['other-injuries']

    // If coming from check answers page then return there after clicking continue
    if (req.session.data['backtocheckanswers'] == 'true') {

      if (otherInjuries == 'Yes') {
        req.session.data['injuryVar'] = 'true'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/other-injuries')
      } else {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
      }
    } else {
      if (otherInjuries == 'Yes') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/other-injuries')
      } else {
        // Will need to flag error if Whiplash is also set to No
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
      }
    }

  }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/where-is-the-injury-route', function (req, res) {

  const injury = req.session.data['injury']

  if (injury) {

    // Check and remove _unchecked value
    for (var i = injury.length; i--;) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }

    if (injury[0] == 'Physical injury other than whiplash') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/where-is-the-injury')
    } else if (injury[0] == 'Psychological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/psychological')
    } else if (injury[0] == 'Neurological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/neurological')
    } else {
      // do nothing
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/other-injuries')
    }

  }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/injury-physical-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On physical injury page
    if (injury[1] == 'Psychological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/psychological')
    } else if (injury[1] == 'Neurological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/neurological')
    } else {

      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
      } else {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
      }
    }

})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/injury-psychological-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On psychological injury page
    if (injury[1] == 'Neurological' || injury[2] == 'Neurological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/neurological')
    } else {
      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
      } else {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_0b/check-answers-update')
      }
    }
})


router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/action-options2', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
} else if (req.session.data['change'] == 'Injured person') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/confirmation_message')
} else if (req.session.data['change'] == 'Injury') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/confirmation_letter')
} else if (req.session.data['change'] == 'Treatment') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/confirmation_reminder')
  } else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/actions')
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/other-injuries-route', function (req, res) {

  // check for no/no situation with whiplash and other injuries, and redirect to error page
  if(req.session.data['other-injuries'] == 'No') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
  } else if(req.session.data['whiplash'] == 'Yes' || req.session.data['other-injuries'] == 'Yes') {

    const otherInjuries = req.session.data['other-injuries']

    // If coming from check answers page then return there after clicking continue
    if (req.session.data['backtocheckanswers'] == 'true') {

      if (otherInjuries == 'Yes') {
        req.session.data['injuryVar'] = 'true'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/other-injuries')
      } else {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
      }
    } else {
      if (otherInjuries == 'Yes') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/other-injuries')
      } else {
        // Will need to flag error if Whiplash is also set to No
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
      }
    }

  }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/where-is-the-injury-route', function (req, res) {

  const injury = req.session.data['injury']

  if (injury) {

    // Check and remove _unchecked value
    for (var i = injury.length; i--;) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }

    if (injury[0] == 'Physical injury other than whiplash') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/where-is-the-injury')
    } else if (injury[0] == 'Psychological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/psychological')
    } else if (injury[0] == 'Neurological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/neurological')
    } else {
      // do nothing
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/other-injuries')
    }

  }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/injury-physical-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On physical injury page
    if (injury[1] == 'Psychological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/psychological')
    } else if (injury[1] == 'Neurological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/neurological')
    } else {

      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
      } else {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
      }
    }

})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/injury-psychological-route', function (req, res) {

    const injury = req.session.data['injury']

    // Check and remove _unchecked value
    for (var i=injury.length; i--; ) {
      if (injury[i] === '_unchecked') {
        injury.splice(i, 1);
      }
    }
    // On psychological injury page
    if (injury[1] == 'Neurological' || injury[2] == 'Neurological') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/neurological')
    } else {
      // If coming from check answers page then return there after clicking continue or continue as normal journey
      if(req.session.data['backtocheckanswers'] == 'true') {
        req.session.data['backtocheckanswers'] = 'false'
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
      } else {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/CRU4_v1_1/check-answers-update')
      }
    }
})

router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/benefit-options', function (req, res) {

if (req.session.data['change'] == 'Liability') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/confirmation_benefits')
} else {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/check-answers-benefits')
    }
})



// router.post('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed-check', function (req, res) {
//
// if (req.session.data['link'] == 'yes') {
//   res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/linking')
// } else {
//       res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v1_0/confirmed')
//     }
// })

//
module.exports = router
