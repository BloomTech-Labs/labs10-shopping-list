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

    @IBOutlet weak var groupName: UIButton!
    static let storyboardName: StoryboardName = "MainViewController"
    
    var user: User?
    var selectedGroup: Group?
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        let groupCon = GroupController()
        groupCon.getGroupWith(userID: 501) { (groups) in
            
            if let groups = groups {
                self.user?.groups = groups
                self.selectedGroup = groups[0]
                self.updateViews()
            }
        }
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
    
    
    
    func updateViews() {
        
        if let name = selectedGroup {
            groupName.setTitle(name.name, for: .normal)
        }
        
    }

}

