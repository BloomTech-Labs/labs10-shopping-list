//
//  CoreDataController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit
import CoreData

class CoreDataManager: NSObject {
    
    static let shared = CoreDataManager()
    
    lazy var persistentContainer: NSPersistentContainer = {
        // 1. Fetch your container
        let container = NSPersistentContainer(name: "ShoppingList")
        // 2. Load your stores
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            // A description or an error will be returned for each store loaded from the container
            if let error = error as NSError? {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()
    
    //Helper variable to get the Managed Object Context
    lazy var managedContext: NSManagedObjectContext = {
        return persistentContainer.viewContext
    }()
    
}

// MARK: Utility Methods
extension CoreDataManager {
    
    
    // let predicate = NSPredicate(format: "name LIKE %@", "Fetcheroni Pizza")
    // let fetched = CoreDataManager.shared.fetch(Recipe.self, predicate: predicate)
    func fetch<M: NSManagedObject>(_ type: M.Type, predicate: NSPredicate?=nil, sort: NSSortDescriptor?=nil) -> [M]? {
        
        var fetched: [M]?
        let entityName = String(describing: type)
        let request = NSFetchRequest<M>(entityName: entityName)
        
        request.predicate = predicate
        request.sortDescriptors = [sort] as? [NSSortDescriptor]
        
        do {
            fetched = try managedContext.fetch(request)
        }
        catch {
            print("Error executing fetch: \(error)")
        }
        return fetched
    }
    
    
    // CoreDataManager.shared.new(Recipe.self)
    func new<M: NSManagedObject>(_ type: M.Type) -> M? {
        
        var modelObject: M?
        
        if let entity = NSEntityDescription.entity(forEntityName: M.description(), in: managedContext) {
            modelObject = M(entity: entity, insertInto: managedContext)
        }
        return modelObject
    }
    
    
    func save() {
        if managedContext.hasChanges {
            do {
                try managedContext.save()
            } catch {
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }
    
    
    // CoreDataManager.shared.delete(by: recipe.objectID)
    func delete(by objectID: NSManagedObjectID) {
        
        let managedObject = managedContext.object(with: objectID)
        managedContext.delete(managedObject)
    }
    
    
    // let predicate = NSPredicate(format: "name LIKE %@", "Deep Pan Pizza")
    // CoreDataManager.shared.delete(Recipe.self, predicate: predicate)
    func delete<M: NSManagedObject>(_ type: M.Type, predicate: NSPredicate?=nil) {
        
        if let objects = fetch(type, predicate: predicate) {
            for modelObject in objects {
                delete(by: modelObject.objectID)
            }
        }
        
        if managedContext.deletedObjects.count > 0 {
            save()
        }
    }

}

