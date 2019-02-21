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


class LoginViewController: UIViewController, StoryboardInstantiatable {
    
    static func accessToken() -> String? {
        if let tk = KeychainWrapper.standard.string(forKey: "accessToken") {
            NSLog("accessToken: \(tk)")
            return tk
        }
        NSLog("NO ACCESS TOKEN")
        return nil
    }
    
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

                    //                    guard let accessToken = credentials.accessToken else {return}
                    //                    self.showSuccessAlert(accessToken)
                    //  print("credentials: \(String(describing: credentials.idToken))")
                    let accessToken = credentials.accessToken
                    let saveAccessToken: Bool = KeychainWrapper.standard.set(accessToken!, forKey: "accessToken")
                    print("The access token save result: \(saveAccessToken)")
                    print("The access token save result: \(String(describing: accessToken))")
                    

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
