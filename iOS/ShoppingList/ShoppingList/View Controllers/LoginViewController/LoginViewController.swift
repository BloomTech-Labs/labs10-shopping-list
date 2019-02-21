//
//  LoginViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit
import Auth0


class LoginViewController: UIViewController, StoryboardInstantiatable {
  
    let credentialsManager = CredentialsManager.init(authentication: Auth0.authentication())
    static let storyboardName: StoryboardName = "LoginViewController"

    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func loginButtonPressed(_ sender: Any) {
        Auth0
            .webAuth()
            //.audience("https://shoptrak-backend.herokuapp.com/api/auth/login")
            .start { result in
                switch result {
                case .success(let credentials):
                    print("auth0 success: \(credentials)")
                    UI {
                        defaults.set(true, forKey: Keys.isUserLoggedInKey)
                        UIApplication.shared.keyWindow?.rootViewController = MainViewController.instantiate()
                    }
                case .failure(let error):
                    print("auth0 failed: \(error)")
                }
            }
    }

    fileprivate func showSuccessAlert(_ accessToken: String) {
        let alert = UIAlertController(title: "Success", message: "accessToken: \(accessToken)", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
    
}
