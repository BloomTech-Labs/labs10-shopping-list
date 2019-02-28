//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0

class MainViewController: UIViewController, StoryboardInstantiatable, GroupsPopoverViewDelegate {
    
    static let storyboardName: StoryboardName = "MainViewController"
    @IBOutlet weak var groupName: UIButton!
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        GroupController.getUserID { (user) in
            
            guard let userID = user?.id else {return}
            
            GroupController.getGroups(forUserID: userID) { (success) in
                if allGroups.count > 0 {
                    selectedGroup = allGroups[0]
                    UI { self.updateViews() }
                }
                
            }
            
            
        }
    }
    
    private func updateViews() {
        if let name = selectedGroup {
            groupName.setTitle(name.name, for: .normal)
        }
    }
    
    func selectedGroupChanged() {
        updateViews()
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
    }
    
    @IBAction func showGroupsButtonPressed(_ sender: Any) {
        Popovers.triggerGroupsPopover(self)
    }
    
    @IBAction func settingsButtonPressed(_ sender: Any) {
        let storyboard = UIStoryboard(name: "SettingsTableViewController", bundle: nil)
        let settingsVC = storyboard.instantiateInitialViewController() ?? SettingsTableViewController.instantiate()
        present(settingsVC, animated: true, completion: nil)
    }
}




