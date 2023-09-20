// https://docs.cypress.io/api/introduction/api.html

//Mocks login for the tests by manually sending correct api request and storing the response in the session storage
const loginUser = (name, attempt = 1) => {
  const password = attempt === 1 ? 'cypresstest123' : 'newPassword';

  cy.session(name, () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/auth/credentials', //   http://localhost:8080/api/auth/credentials    |   https://api.smartmat.app/api/auth/credentials
      body: { username: name, password },
      failOnStatusCode: false,
    }).then(({ body, status }) => {
      if (status === 200) {
        window.sessionStorage.setItem('UserStore', JSON.stringify({ token: body, username: name }))
        const groupData = { groupId: 88, groupAuth: 'ADMIN', groupName: 'cypresskjøl' }
        window.sessionStorage.setItem('GroupStore', JSON.stringify(groupData))
      } else if (status === 401 && attempt < 2) {
        // If the status is 401 and it's the first attempt, retry with the newPassword
        loginUser(name, attempt + 1);
      } else {
        // Log an error message if the second attempt also fails
        console.error('Login failed with status:', status);
      }
    })
  })
}


//Mocks logout for the tests by manually clearing the session storage
const logout = () => {
  window.sessionStorage.clear()
}

describe('Home Page when not logged in', () => {
  it('Loads successfully', () => {
    cy.visit('/')
    cy.contains('h1', 'Vær med å gjør en forskjell for miljøet og få en bedre hverdag!')
  })
})

describe('Login Page', () => {
  it('Logs in a user successfully', () => {
    // Visit the login page
    cy.visit('/login')
    
    // Enter username and password
    cy.get('#username').type('cypress2')
    cy.get('#password').type('cypresstest123')
    
    // Submit the login form
    cy.get('form').submit()
    
    // Check if the user is redirected to the correct page
    cy.url().should('include', '/')

    logout()

  })
})


describe('Test visiting the urls of the page when the user is logged in', () => {

  beforeEach(() => {
    logout()
    loginUser('cypress2')
  })  

  it('Logs out a user successfully', () => {
    cy.visit('/profile')
    cy.get('button').contains('Logg ut').click()
    cy.url().should('include', '/login')
  })

  //Profile page
  it('visits the profile url when logged in', () => {
    cy.visit('/profile')
    cy.get('h1').should('contain', 'Profil')
    cy.get('h2').should('contain', 'Velkommen, cypress2')
  })


  it('visits the profile/profile url when logged in', () => {
    cy.visit('/profile/profile')
    cy.get('h1').should('contain', 'Profil')
    cy.get('h2').should('contain', 'Fyll inn feltene du ønsker å endre')
  })

  it('visits the profile/groups url when logged in', () => {
    cy.visit('/profile/groups')
    cy.get('h1').should('contain', 'Grupper')

  })

  it('visits the profile/allergens url when logged in', () => {
    cy.visit('/profile/allergens')
    cy.get('h1').should('contain', 'Allergener')
    cy.get('h2').should('contain', 'Velg dine allergener:')

  })

  it('visits the /plan url when logged in', () => {
    cy.visit('/plan')
    cy.wait(3000)
    cy.get('h1').should('contain', 'Generer ukesmeny for ditt kjøleskap')
    cy.get('h2').should('contain', 'Dag: 1')

  })

  //Home page
  it('visits the home url when logged in', () => {
    cy.visit('/')
    cy.get('h2').should('contain', 'Penger tapt på matsvinn:')
    cy.get('a').should('contain', 'Hjem', 'Lister', 'Skann', 'Ukeplan', 'Profil')
  })
  

})


describe('Test that a user can join/create a group', () => {

  beforeEach(() => {
    logout()
    loginUser('cypress2')
  })  



    it('joins a group, then leaves', () => {
      cy.visit('/profile/groups')
      cy.get('button').contains('Opprett/bli med i en gruppe').click()
      cy.get('button').should('contain', 'Bli med')
      cy.get('button').should('contain', 'Opprett nytt')
      cy.get('button').contains('Bli med').click()
      cy.get('input[placeholder*="Kjøleskapskode"]').type('qwerty')
      cy.get('button').contains('Bli med').click()
      cy.wait(3000)
      cy.visit('/profile/groups')
      cy.get('div').should('contain', 'Group D')
      cy.get('.group-button .group-button-name h2')
      .contains('Group D')
      .click()

      cy.get('button').contains('Forlat gruppe').click()
      cy.wait(3000)
      cy.visit('/profile/groups')
      cy.get('div').should('not.contain', 'Group D')
    })

    it('sees info about group', () => {
      cy.visit('/profile/groups')
      cy.get('.group-button .group-button-name h2')
      .contains('cypresskjøl')
      .click()

      cy.get('h1').should('contain', 'cypresskjøl')
      cy.get('h3').should('contain', 'Administrator')

    })

    
    /* Commented out to not generate excessive amounts of groups
    it('creates a group, then leaves', () => {
      cy.get('button').contains('Opprett/bli med i en gruppe').click()
      cy.get('button').contains('Opprett nytt').click()
      cy.get('input[placeholder*="Kjøleskapsnavn"]').type('cypressGroup')
      cy.get('button').contains('Lag kjøleskap').click()
      cy.visit('/profile/groups')
      cy.get('div').should('contain', 'cypressGroup')
      cy.get('.group-button .group-button-name h2')
      .contains('cypressGroup')
      .click()

      cy.get('button').contains('Forlat gruppe').click()
      cy.visit('/profile/groups')
      cy.get('div').should('not.contain', 'cypressGroup')
    })

    */

  


})


describe('Test that a user can see/change profile settings', () => {
  beforeEach(() => {
    logout()
    loginUser('cypress2')
    cy.visit('/profile/profile')
  })  


    it('inputs new password and confirms, applies changes, and changes back', () => {
      cy.get('#change-password')
      .type('newPassword')

      cy.get('#change-password-confirm').type('newPassword')
      cy.get('button').contains('Lagre endringer').click()
      cy.visit('/profile/profile')
      cy.get('#change-password')
      .type('cypresstest123')

      cy.get('#change-password-confirm').type('cypresstest123')
      cy.get('button').contains('Lagre endringer').click()

      cy.get("h1").should('contain', 'Profil')

    })

    it('inputs new email, applies changes, and changes back', () => {
      cy.get('#change-email')
      .type('mail@mail.no')

      cy.get('#change-email-confirm').type('mail@mail.no')
      cy.get('button').contains('Lagre endringer').click()
      cy.visit('/profile/profile')
      cy.get('#change-email')
      .type('mail2@mail.no')

      cy.get('#change-email-confirm').type('mail2@mail.no')
      cy.get('button').contains('Lagre endringer').click()

    })

})


describe('Test that the user can add a product to fridge', () => {

  beforeEach(() => {
    logout()
    loginUser('cypress2')
    cy.visit("/scan")
  })  

  it('Finds an apple', () => {
    cy.get('button').contains('Søk manuelt').click()
    cy.get('[placeholder="Søk på navn eller EAN"]').should('exist')
    cy.get('[placeholder="Søk på navn eller EAN"]').type('eple')

    cy.get('.product-search-result-name').should('contain', 'eple')

  })

  it('Finds an apple, and is able to add to fridge', () => {

    cy.get('button').contains('Søk manuelt').click()
    cy.get('[placeholder="Søk på navn eller EAN"]').type('eple')
    cy.get('button').contains('Velg').click()
    cy.get('button').should('contain', 'Legg til i kjøleskap')
    cy.get('button').contains('Legg til i kjøleskap').click()
    cy.wait(2000)
    cy.visit('/list')

    cy.wait(4000)
    cy.get('div').should('contain', 'eple')
    cy.get('svg[data-icon="trash-can"]').parent('button').first().click()
    
    cy.wait(2000)

    cy.get('button').contains('Ja').click()
    cy.get('div').should('not.contain', 'eple')
  })

  it('Finds an apple, and is able to add to fridge, then eats it', () => {

    cy.get('button').contains('Søk manuelt').click()
    cy.get('[placeholder="Søk på navn eller EAN"]').type('eple')
    cy.get('button').contains('Velg').click()
    cy.get('button').should('contain', 'Legg til i kjøleskap')
    cy.get('button').contains('Legg til i kjøleskap').click()
    cy.visit('/list')

    cy.wait(4000)
    cy.get('div').should('contain', 'eple')
    cy.get('svg[data-icon="utensils"]').parent('button').first().click()
    
    cy.wait(2000)

    cy.get('button').contains('Ja').click()
    cy.get('div').should('not.contain', 'eple')
  })

})


describe('Test that the user can add a product to shoppinglist', () => {

  beforeEach(() => {
    logout()
    loginUser('cypress2')
    cy.visit("/list")
  })  

  it('is directed to shoppinglist', () => {
    cy.get('button').contains('Handleliste').click()
    cy.get('button').should('contain', 'Legg til et produkt')

  })

  it('adds apple to shoppinglist, then removes it', () => {
    cy.get('button').contains('Handleliste').click()
    cy.get('button').contains('Legg til et produkt').click()
    cy.get('[placeholder="Søk på navn eller EAN"]').type('eple')
    cy.wait(1000)
    cy.get('button').contains('Velg').click()
    cy.wait(1000)
    cy.get('div').should('contain', 'eple')
    cy.get('svg[data-icon="xmark"]').parent('button').first().click()
    cy.get('div').should('not.contain', 'eple')


  })




})