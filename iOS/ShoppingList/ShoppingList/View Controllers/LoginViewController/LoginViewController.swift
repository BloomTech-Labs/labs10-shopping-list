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
    
    static let storyboardName: StoryboardName = "LoginViewController"

    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    @IBAction func loginButtonPressed(_ sender: Any) {
        defaults.set(true, forKey: Keys.isUserLoggedInKey)
        UIApplication.shared.keyWindow?.rootViewController = MainViewController.instantiate()
    }

}
