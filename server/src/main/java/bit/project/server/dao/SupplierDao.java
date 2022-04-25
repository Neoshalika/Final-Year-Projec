package bit.project.server.dao;

import bit.project.server.entity.Employee;
import bit.project.server.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SupplierDao extends JpaRepository<Supplier, Integer>{
    @Query("select new Supplier (s.id,s.code,s.name,s.email,s.contact1) from Supplier s")
    Page<Supplier> findAllBasic(PageRequest pageRequest);

    @Query("select new Supplier (s.id,s.code,s.name,s.email,s.contact1) from Supplier s where s.supplierstatus.id=1")
    Page<Supplier> findAllBasicActives(PageRequest pageRequest);

    Supplier findByCode(String code);
    Supplier findByContact1(String contact1);
    Supplier findByEmail(String email);
    Supplier findByFax(String fax);
}
