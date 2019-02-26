//
//  LoginViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit
import Auth0
import SwiftKeychainWrapper
import SimpleKeychain


class LoginViewController: UIViewController, StoryboardInstantiatable {
    
    

  
    
    let credentialsManager = CredentialsManager.init(authentication: Auth0.authentication())
    static let storyboardName: StoryboardName = "LoginViewController"
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func loginButtonPressed(_ sender: Any) {
        checkAccessToken()
        

    }
    
    
    
    
    
    

    func showLogin() {
        
        Auth0
            .webAuth()
            .audience("https://shoptrak.auth0.com/api/v2/")
            .scope("openid profile email")
            .start {
                switch $0 {
                case .failure(let error):
                    // Handle the error
                    print("Error: \(error)")
                case .success(let credentials):
                    guard let accessToken = credentials.accessToken, let idToken = credentials.idToken else { return }
                    SessionManager.shared.storeTokens(accessToken, idToken: idToken)
                    SessionManager.shared.retrieveProfile { error in
                        guard error == nil else {
                            return self.showLogin()
                        }
                        
                    }
                }
        }
        
    }
    
    func checkAccessToken() {
        
        SessionManager.shared.logout()
        SessionManager.shared.retrieveProfile { error in
            guard error == nil else {
                return self.showLogin()
            }
            UI {
                defaults.set(true, forKey: Keys.isUserLoggedInKey)
                UIApplication.shared.keyWindow?.rootViewController = MainViewController.instantiate()
            }
        }
    }
}

