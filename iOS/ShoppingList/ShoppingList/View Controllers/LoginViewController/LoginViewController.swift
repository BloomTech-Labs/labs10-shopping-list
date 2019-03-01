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
    
    static let storyboardName: StoryboardName = "LoginViewController"
    let credentialsManager = CredentialsManager.init(authentication: Auth0.authentication())
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func loginButtonPressed(_ sender: Any) {
        showLogin()
    }

    func showLogin() {
        Auth0
            .webAuth()
            .audience("https://shoptrak.auth0.com/api/v2/")
            .scope("openid profile email")
            .start {
                switch $0 {
                case .failure(let error):
                    print("showLogin: \(error)")
                case .success(let credentials):
                    guard let accessToken = credentials.accessToken, let idToken = credentials.idToken else { return }
                    SessionManager.tokens = Tokens(accessToken: accessToken, idToken: idToken)
                    UI {
                        UIApplication.shared.keyWindow?.rootViewController = MainViewController.instantiate()
                    }
                }
        }
        
    }
}

