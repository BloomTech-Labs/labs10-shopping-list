//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0

class MainViewController: UIViewController, StoryboardInstantiatable, PopoverViewDelegate {
    
    static let storyboardName: StoryboardName = "MainViewController"
    @IBOutlet weak var groupName: UILabel!
    @IBOutlet weak var tableView: UITableView!
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.rowHeight = 80
        tableView.tableFooterView = UIView()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ReuseIdentifier")
        
        GroupController.shared.getUserID { (user) in
            
            guard let userID = user?.profile.id else { return }
            
            GroupController.shared.getGroups(forUserID: userID) { (success) in
                if allGroups.count > 0 {
                    selectedGroup = allGroups[0]
                    UI { self.updatesNeeded() }
                }
            }
            
        }
    }
    
    func updatesNeeded() {
        guard let selectedGroup = selectedGroup else { return }
        groupName.text = selectedGroup.name
        ItemController.shared.loadItems { (_) in
            UI { self.tableView.reloadData() }
        }
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
        Popovers.triggerNewItemPopover(self)
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


extension MainViewController: UITableViewDataSource, UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return selectedGroup?.items?.count ?? 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ReuseIdentifier", for: indexPath)
        guard let selectedGroup = selectedGroup else { return cell }
        guard let item = selectedGroup.items?[indexPath.row] else { return cell }
        cell.textLabel?.text = item.name
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    
    private func tableView(tableView: UITableView!, canEditRowAtIndexPath indexPath: NSIndexPath!) -> Bool {
        return true
    }
    
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        
        
        let delete = deleteAction(at: indexPath)
        
        return UISwipeActionsConfiguration(actions: [delete]) as UISwipeActionsConfiguration
    }
    
    
    func deleteAction(at indexPath: IndexPath) -> UIContextualAction {
        
        let action = UIContextualAction(style: .destructive, title: "delete") { (action, view, completion) in
        
            guard let selectedGroup = selectedGroup else { return }
                 guard let item = selectedGroup.items?[indexPath.row] else { return }
            ItemController.shared.deleteItem(id: item.id!) {(_) in
           
        }
         completion(true)
        }
        action.backgroundColor = .red
        action.title = "Delete"
        
        return action
    }
    
    

}
