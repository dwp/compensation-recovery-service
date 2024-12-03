const express = require('express')
const router = express.Router()
// Add your routes here - above the module.exports line


router.post('/registration/nn-guard', function (req, res, next) {

  const nino = req.session.data['ni-number']

  if (!nino) {
    res.redirect('/beta-v4/registration/about-the-injured-person-nn')
  } else {
    res.redirect('/beta-v4/registration/date-of-claim')
  }
})

router.post('/nhs-claim/nn-guard', function (req, res, next) {

  const nino = req.session.data['ni-number']

  if (!nino) {
    res.redirect('/beta-v4/nhs-claim/about-the-injured-person-nn')
  } else {
    res.redirect('/beta-v4/nhs-claim/date-of-claim')
  }
})


router.post('/registration/confirmation-route', function (req, res, next) {

  const nino = req.session.data['ni-number']

  if (!nino) {
    res.redirect('/beta-v4/registration/confirmation-nn')
  } else {
    res.redirect('/beta-v4/registration/confirmation')
  }
})

router.post('/nhs-claim/confirmation-route', function (req, res, next) {

  const nino = req.session.data['ni-number']

  if (!nino || req.session.data['treatment'] == 'Yes') {
    res.redirect('/beta-v4/nhs-claim/confirmation-nn')
  } else {
    res.redirect('/beta-v4/nhs-claim/confirmation')
  }
})


// Account guard screen not required at present
// router.post('/account-management/org-create-account-check', function (req, res, next) {
//
//   const accountType = req.session.data['account-type']
//
//   if (accountType == 'User account') {
//     res.redirect('/beta-v4/account-management/user-create-account')
//   } else if (accountType == 'Organisation account') {
//     res.redirect('/beta-v4/account-management/org-create-account')
//   }
// })

// Company name match - not currently in use for testing
router.post('/account-management/org-company-name-check', function (req, res, next) {

  const companyName = req.session.data['company-name']
  const companyNameSplit = companyName.split(' ').slice(0,2).join('+')

  if (companyNameSplit == 'John+Smith' && companyName != 'John Smith Associates') {
    res.redirect('/beta-v4/account-management/org-company-name-error')
  } else if (companyNameSplit == 'John+Smith' && companyName == 'John Smith Associates') {
    res.redirect('/beta-v4/account-management/org-company-name-error-match')
  } else {
    res.redirect('/beta-v4/account-management/org-details')
  }

  // if (companyNameSplit == 'John+Smith' && companyName != 'John Smith Associates') {
  //   res.redirect('/beta-v4/account-management/org-company-name-error')
  // } else if (companyNameSplit == 'John+Smith' && companyName == 'John Smith Associates') {
  //   res.redirect('/beta-v4/account-management/org-company-name-error-match')
  // } else {
  //   res.redirect('/beta-v4/account-management/org-details')
  // }
})

// Route to either Org or user account journey
router.post('/account-management/password-branch', function (req, res, next) {

  const accountType = req.session.data['account-type']

  if (accountType == 'user') {
    res.redirect('/beta-v4/account-management/user-edit-name')
  } else if (accountType == 'org') {
    res.redirect('/beta-v4/account-management/org-user-name')
  } else if (accountType == 'requested-user') {
    res.redirect('/beta-v4/account-management/user-request-confirmation')
  }
})

router.post('/account-management-dsa/password-branch', function (req, res, next) {

  const accountType = req.session.data['account-type']

  if (accountType == 'user') {
    res.redirect('/beta-v4/account-management-dsa/user-edit-name')
  } else if (accountType == 'org') {
    res.redirect('/beta-v4/account-management-dsa/org-user-name')
  } else if (accountType == 'requested-user') {
    res.redirect('/beta-v4/account-management-dsa/user-request-confirmation')
  }
})


router.post('/account-management/user-type-branch', function (req, res, next) {

  const standardUser = req.session.data['standard-user']

  if (standardUser == 'false') {
    res.redirect('/beta-v4/account-management/admin-user/admin-dashboard')
  } else if (standardUser == 'true') {
    res.redirect('/beta-v4/account-management/standard-user/user-dashboard')
  }
})

// Account registration - DA/TPA - if compensator, skip asking the working on behalf of question
router.post('/account-management/org-tpa-route', function (req, res, next) {

  const orgType = req.session.data['type-of-org']

  if (orgType == 'Third Party Administrator') {
    res.redirect('/beta-v4/account-management/org-working-on-behalf')
  } else {
    res.redirect('/beta-v4/account-management/org-user-agreement')
  }
})

router.post('/account-management-dsa2/org-tpa-route', function (req, res, next) {

  const orgType = req.session.data['type-of-org']

  if (orgType == 'Third Party Administrator') {
    res.redirect('/beta-v4/account-management-dsa2/org-working-on-behalf')
  } else {
    res.redirect('/beta-v4/account-management-dsa2/opt_in')
  }
})

router.post('/account-management-dsa4/org-tpa-route', function (req, res, next) {

  const orgType = req.session.data['type-of-org']

  if (orgType == 'Third Party Administrator') {
    res.redirect('/beta-v4/account-management-dsa4/org-working-on-behalf')
  } else {
    res.redirect('/beta-v4/account-management-dsa4/org-user-name')
  }
})

// Account registration - DA/TPA - if working on behalf of other orgs, capture orgs, otherwise skip this section
router.post('/account-management/org-working-on-behalf-route', function (req, res, next) {

  const onBehalfOf = req.session.data['on-behalf-of']

  if (onBehalfOf == 'Yes') {
    res.redirect('/beta-v4/account-management/org-working-on-behalf-name')
  } else if (onBehalfOf == 'No') {
    res.redirect('/beta-v4/account-management/org-user-agreement')
  }
})

router.post('/account-management-dsa2/org-working-on-behalf-route', function (req, res, next) {

  const onBehalfOf = req.session.data['on-behalf-of']

  if (onBehalfOf == 'Yes') {
    res.redirect('/beta-v4/account-management-dsa2/org-working-on-behalf-name')
  } else if (onBehalfOf == 'No') {
    res.redirect('/beta-v4/account-management-dsa2/opt_in')
  }
})


router.post('/account-management-dsa4/org-working-on-behalf-route', function (req, res, next) {

  const onBehalfOf = req.session.data['on-behalf-of']

  if (onBehalfOf == 'Yes') {
    res.redirect('/beta-v4/account-management-dsa4/org-working-on-behalf-name')
  } else if (onBehalfOf == 'No') {
    res.redirect('/beta-v4/account-management-dsa4/org-user-name')
  }
})

// NO NINO TASK FOR OPS. Simulates the route to unhappy path if the Nino cannot be found on CIS. (Use error=benefit to flag the benefits found error)
router.post('/cru-ops-service/tasks-and-workflows/completed-task-route', function (req, res, next) {

  const updatedNINO = req.session.data['updated-ni-number']

  if (updatedNINO == '1') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/action-task?error=nino&')
  } else {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/completed-task')
  }
})


// ************* NHS Hospitals and Trusts Routing ************* //

// Route to view either hospital or trust
router.post('/cru-ops-service/nhs-hospitals/view-route', function (req, res, next) {

  const searchResults = req.session.data['search-results']

  if (searchResults == 'Cheltenham General Hospital, Sandford road, Cheltenham, Glos. GL53 7AN, RTE') {
    res.redirect('/beta-v4/cru-ops-service/nhs-hospitals/view-hospital')
  } else if (searchResults == 'Gloucestershire Hospitals NHS Foundation Trust, RTE') {
    res.redirect('/beta-v4/cru-ops-service/nhs-hospitals/view-trust')
  } else if (searchResults == 'Isle of Wight Ambulance Trust, R1FIW') {
    res.redirect('/beta-v4/cru-ops-service/nhs-hospitals/view-ambulance-trust')
  } else {
    // doo nothing
    res.redirect('/beta-v4/cru-ops-service/nhs-hospitals/')
  }
})

// Add new Hospital or Trust - route for either hospital or trust
router.post('/cru-ops-service/nhs-hospitals/add-new-type-route', function (req, res, next) {

  const addNewType = req.session.data['add-new']

  if (addNewType == 'Hospital') {
    res.redirect('/beta-v4/cru-ops-service/nhs-hospitals/add-new-hospital-add-trust')
  } else if (addNewType == 'Trust') {
    res.redirect('/beta-v4/cru-ops-service/nhs-hospitals/add-new-trust-orgcode')
  } else if (addNewType == 'Ambulance Trust') {
    res.redirect('/beta-v4/cru-ops-service/nhs-hospitals/add-new-ambulance-trust-orgcode')
  }
})

// router.post('/registration/certificate-delivery-question', function (req, res, next) {
//
//   const certPrefs = req.session.data['cert-prefs']
//
//   if (certPrefs == 'Email') {
//     res.redirect('email-page')
//   } else if (certPrefs == 'Post') {
//     res.redirect('post-page')
//   } else if (certPrefs == 'Email,Post') {
//     res.redirect('email-then-post-page')
//   } else {
//     req.session.data['certPrefValidation'] = 'true'
//     res.redirect('compensator-preferences')
//   }
// })


// CRU Ops - TASKS TO DO
  router.post('/cru-ops-service/tasks-and-workflows/tasks', function (req, res, next) {

    const tasktype = req.session.data['tasktype']

    if (tasktype == 'nonino') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/action-task')
    } else if (tasktype == 'expiredcertificate') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/certs-tasks')
    } else if (tasktype == 'existingclaim') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/v2-action-task-da')
    } else if (tasktype == 'legacyclaim') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/action-legacy-task')
    }
  })

  // NHS Ops - TASKS TO DO
  // V1
  router.post('/cru-ops-service/tasks-and-workflows/nhs-not-known/tasks', function (req, res, next) {

    const tasktype = req.session.data['tasktype']

    if (tasktype == 'task1') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known/2-task-1')
    } else if (tasktype == 'task2') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known/2-task-2')
    } else if (tasktype == 'letter') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known/5-completed-letter')
    } else if (tasktype == 'closetask') {
      res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known/5-completed-close')
    }

  })

    // V2
    router.post('/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/tasks', function (req, res, next) {

      const tasktype = req.session.data['tasktype']

      if (tasktype == 'task1') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/2-task-1')
      } else if (tasktype == 'task2') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/2-task-2')
      } else if (tasktype == 'letter') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/5-completed-letter')
      } else if (tasktype == 'closetask') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/5-completed-close')
      } else if (tasktype == 'yes') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/5-completed-yes')
      }

    })

    // NHS Ops - NHS TREATMENT
    // V1
    router.post('/cru-ops-service/tasks-and-workflows/nhs-not-known/treatment', function (req, res, next) {

      const treatment = req.session.data['treatment']

      if (treatment == 'yes') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known/3-hospital')
      } else if (treatment == 'no') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known/2-task-no')
      }

    })

      // V2
      router.post('/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/treatment', function (req, res, next) {

        const treatment = req.session.data['treatment']

        if (treatment == 'yes') {
          res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/5-completed-yes')
        } else if (treatment == 'letter') {
          res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/5-completed-letter')
        } else if (treatment == 'close') {
          res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows/nhs-not-known-v2/5-completed-close')
        }

      })

// V2
router.post('/cru-ops-service/claim-update3/answer', function (req, res, next) {

  const treatment = req.session.data['treatment']

  if (treatment == 'Yes') {
    res.redirect('/beta-v4/cru-ops-service/claim-update3/exemption')
  } else if (treatment == 'No') {
    res.redirect('/beta-v4/cru-ops-service/claim-update3/change-confirmation')
  } else if (treatment == 'Not known') {
    res.redirect('/beta-v4/cru-ops-service/claim-update3/check-answers')
  }

})

 // NHS Ops - NOTES
    router.post('/cru-ops-service/note/add-note', function (req, res, next) {

      const note = req.session.data['note']

      if (note == 'nhs') {
        res.redirect('/beta-v4/cru-ops-service/note/2a-nhs')
      } else if (note == 'comment') {
        res.redirect('/beta-v4/cru-ops-service/note/2b-comment')
      }

    })

    router.post('/cru-ops-service/tasks-and-workflows2_0/note/add-note', function (req, res, next) {

      const note = req.session.data['note']

      if (note == 'nhs') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/note/2a-nhs')
      } else if (note == 'comment') {
        res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/note/2b-comment')
      }

    })

// SCRUTINY E-PARTNER INJURY DESCRIPTION
router.post('/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v2/injury-description', function (req, res, next) {

const injury = req.session.data['injury']

if (injury == 'yes') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v2/3-task-completed')
} else if (injury == 'no') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v2/3-task-completed')
} else if (injury == 'edit') {
  res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v2/3c-edit')
}

})

// CLAIM OPTIONS
router.post('/cru-ops-service/issue-cert/actions', function (req, res, next) {

  const option = req.session.data['option']

  if (option == 'update') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v2/3-task-completed')
  } else if (option == 'reminder') {
    res.redirect('/beta-v4/cru-ops-service/tasks-and-workflows2_0/scrutiny_task_v2/3-task-completed')
  } else if (option == 'certificate') {
    res.redirect('/beta-v4/cru-ops-service/issue-cert/2-check')
  }

  })

  // CLAIM OPTIONS - issue certificate of NHS charges
router.post('/cru-ops-service/issue-cert/issue', function (req, res, next) {

  const certificate = req.session.data['certificate']

  if (certificate == 'yes') {
    res.redirect('/beta-v4/cru-ops-service/issue-cert/3-confirmation')
  } else if (certificate == 'no') {
    res.redirect('/beta-v4/cru-ops-service/issue-cert/0-case-view')
  }

  })

  // UPDATE CLAIM DETAILS - not known NHS hospital treatment
router.post('/cru-ops-service/claim-update4/treatment/nhsguardnotknown', function (req, res, next) {

  const treatment = req.session.data['treatment']

  if (treatment == 'Yes') {
    res.redirect('/beta-v4/cru-ops-service/claim-update4/treatment/hospital')
  } else if (treatment == 'No') {
    res.redirect('/beta-v4/cru-ops-service/claim-update4/treatment/confirmation2')
  } else if (treatment == 'No2') {
    res.redirect('/beta-v4/cru-ops-service/claim-update4/treatment/confirmation4')
  }

  })

module.exports = router
