//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0
import SwiftKeychainWrapper

class MainViewController: UIViewController, StoryboardInstantiatable {

    static let storyboardName: StoryboardName = "MainViewController"
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
        
     KeychainWrapper.standard.removeObject(forKey: "accessToken")
        let storyboard = UIStoryboard(name: "LoginViewController", bundle: nil)
        let loginVC = storyboard.instantiateInitialViewController() ?? LoginViewController.instantiate()
        present(loginVC, animated: true, completion: nil)
        
    }
    

    
    @IBAction func settingsButtonPressed(_ sender: Any) {
        let storyboard = UIStoryboard(name: "SettingsTableViewController", bundle: nil)
        let settingsVC = storyboard.instantiateInitialViewController() ?? SettingsTableViewController.instantiate()
        present(settingsVC, animated: true, completion: nil)
        print(LoginViewController.accessToken()!)
    }
    

}

